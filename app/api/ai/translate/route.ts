import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Setting from '@/models/Setting'

const LOCALE_NAMES: Record<string, string> = {
  en: 'English',
  ko: 'Korean (한국어)',
  ja: 'Japanese (日本語)',
  zh: 'Chinese Simplified (简体中文)',
}

const MODEL_FALLBACK = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-1.5-flash']

async function callGemini(apiKey: string, model: string, prompt: string): Promise<string> {
  const queue = [model, ...MODEL_FALLBACK.filter(m => m !== model)]
  for (const m of queue) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 16384, temperature: 0.1, responseMimeType: 'application/json' },
        }),
      }
    )
    if (!res.ok) {
      const err = await res.json().catch(() => ({})) as { error?: { message?: string } }
      const msg = err.error?.message ?? ''
      const retryable = res.status === 429 || res.status === 503 || msg.includes('quota')
      if (!retryable) throw new Error(`Gemini ${res.status}: ${msg}`)
      continue
    }
    const json = await res.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> }
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    if (!text) throw new Error('Gemini trả về phản hồi rỗng.')
    return text
  }
  throw new Error('Tất cả model Gemini đều vượt quota. Vui lòng thử lại sau hoặc kích hoạt billing.')
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const setting = await Setting.findOne({ key: 'global' }).lean() as { integrations?: { geminiApiKey?: string; geminiModel?: string } } | null
    const apiKey = setting?.integrations?.geminiApiKey ?? ''
    const model  = setting?.integrations?.geminiModel  ?? 'gemini-2.5-flash'

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Chưa cấu hình Gemini API key. Vào Cài đặt → Tích hợp & API để nhập key.' },
        { status: 503 }
      )
    }

    const body = await req.json() as {
      fields?: { title?: string; excerpt?: string; content?: string }
      targetLocales?: string[]
    }

    const { title = '', excerpt = '', content = '' } = body.fields ?? {}
    const targets = (body.targetLocales ?? ['en', 'ko', 'ja', 'zh']).filter(l => l in LOCALE_NAMES)

    if (!title && !excerpt && !content) {
      return NextResponse.json({ error: 'Cần ít nhất một trường nội dung (tiêu đề, tóm tắt, nội dung).' }, { status: 400 })
    }

    const targetList = targets.map(l => `- ${l}: ${LOCALE_NAMES[l]}`).join('\n')

    const prompt = `You are a professional translator for a Vietnamese media company (WON Media).
Translate the following Vietnamese content into each requested language.

RULES:
- Preserve ALL HTML tags exactly as-is in "content". Only translate text nodes.
- Keep brand names, proper nouns, and technical terms appropriate for each language.
- Return ONLY a valid JSON object. No explanation, no markdown, no code fences.

Source fields (Vietnamese):
Title:   "${title}"
Excerpt: "${excerpt}"
Content: "${content}"

Target languages:
${targetList}

Return format:
{
  "en": { "title": "...", "excerpt": "...", "content": "..." },
  "ko": { "title": "...", "excerpt": "...", "content": "..." }
}`

    const raw = await callGemini(apiKey, model, prompt)
    const cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
    const match = cleaned.match(/\{[\s\S]*\}/)
    const parsed = JSON.parse(match?.[0] ?? cleaned) as Record<string, { title?: string; excerpt?: string; content?: string }>

    const translations: Record<string, { title: string; excerpt: string; content: string }> = {}
    for (const lc of targets) {
      const t = parsed[lc]
      if (t) translations[lc] = { title: t.title ?? '', excerpt: t.excerpt ?? '', content: t.content ?? '' }
    }

    return NextResponse.json({ success: true, translations })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Lỗi không xác định'
    return NextResponse.json({ error: msg }, { status: 502 })
  }
}
