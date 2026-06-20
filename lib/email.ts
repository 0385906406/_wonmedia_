import { Resend } from 'resend'
import { connectDB } from '@/lib/mongodb'
import Setting from '@/models/Setting'

async function getEmailConfig() {
  try {
    await connectDB()
    const setting = await Setting.findOne({ key: 'global' }).lean() as {
      integrations?: { resendApiKey?: string; resendFromEmail?: string; resendToEmail?: string }
    } | null
    const db = setting?.integrations ?? {}
    return {
      apiKey:    db.resendApiKey?.trim()    || process.env.RESEND_API_KEY?.trim()    || '',
      fromEmail: db.resendFromEmail?.trim() || process.env.RESEND_FROM_EMAIL?.trim() || 'onboarding@resend.dev',
      toEmail:   db.resendToEmail?.trim()   || process.env.RESEND_TO_EMAIL?.trim()   || 'contact@wonmedia.vn',
    }
  } catch {
    return {
      apiKey:    process.env.RESEND_API_KEY?.trim()    || '',
      fromEmail: process.env.RESEND_FROM_EMAIL?.trim() || 'onboarding@resend.dev',
      toEmail:   process.env.RESEND_TO_EMAIL?.trim()   || 'contact@wonmedia.vn',
    }
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export async function sendContactNotification(data: {
  name: string
  email: string
  subject: string
  message: string
}) {
  try {
    const { apiKey, fromEmail, toEmail } = await getEmailConfig()

    if (!apiKey) return { ok: false, reason: 'no_api_key' }

    const resend = new Resend(apiKey)

    const sentAt = new Date().toLocaleString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      dateStyle: 'full', timeStyle: 'short',
    })

    const html = `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Tin nhắn mới từ website</title>
</head>
<body style="margin:0;padding:0;background:#F8F9FB;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F9FB;padding:40px 16px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

      <!-- Header -->
      <tr>
        <td style="background:linear-gradient(135deg,#062340 0%,#0F4C81 100%);border-radius:16px 16px 0 0;padding:36px 40px 32px;text-align:center;">
          <div style="font-family:'Space Grotesk',monospace;font-size:22px;font-weight:900;color:#fff;letter-spacing:-0.5px;margin-bottom:6px;">
            WON MEDIA
          </div>
          <div style="font-size:13px;color:rgba(255,255,255,0.6);letter-spacing:1px;text-transform:uppercase;">
            Tin nhắn mới từ website
          </div>
        </td>
      </tr>

      <!-- Alert banner -->
      <tr>
        <td style="background:#00A98F;padding:12px 40px;">
          <p style="margin:0;font-size:13px;font-weight:700;color:#fff;text-align:center;">
            📩 Bạn có một tin nhắn mới cần phản hồi
          </p>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="background:#fff;padding:36px 40px;">

          <!-- Sender info -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
            <tr>
              <td style="padding:16px 20px;background:#F8F9FB;border-radius:12px;border:1px solid #E5E8ED;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:6px 0;border-bottom:1px solid #E5E8ED;">
                      <span style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Người gửi</span><br/>
                      <span style="font-size:15px;font-weight:700;color:#062340;">${escapeHtml(data.name)}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;border-bottom:1px solid #E5E8ED;">
                      <span style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Email</span><br/>
                      <a href="mailto:${escapeHtml(data.email)}" style="font-size:14px;color:#6366F1;text-decoration:none;font-weight:600;">${escapeHtml(data.email)}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;">
                      <span style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Chủ đề</span><br/>
                      <span style="font-size:14px;color:#374151;font-weight:600;">${escapeHtml(data.subject)}</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <!-- Message -->
          <div style="margin-bottom:8px;">
            <span style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Nội dung</span>
          </div>
          <div style="background:#F8F9FB;border-left:4px solid #00A98F;border-radius:0 10px 10px 0;padding:16px 20px;margin-bottom:28px;">
            <p style="margin:0;font-size:14px;line-height:1.75;color:#334155;white-space:pre-wrap;">${escapeHtml(data.message)}</p>
          </div>

          <!-- CTA -->
          <div style="text-align:center;margin-bottom:8px;">
            <a href="mailto:${escapeHtml(data.email)}?subject=Re: ${encodeURIComponent(data.subject)}"
               style="display:inline-block;padding:13px 32px;background:linear-gradient(135deg,#6366F1,#4338CA);color:#fff;font-size:14px;font-weight:700;text-decoration:none;border-radius:10px;">
              Trả lời ngay
            </a>
          </div>

        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#F8F9FB;border-radius:0 0 16px 16px;border:1px solid #E5E8ED;border-top:none;padding:20px 40px;text-align:center;">
          <p style="margin:0 0 4px;font-size:11px;color:#94a3b8;">Gửi lúc ${sentAt}</p>
          <p style="margin:0;font-size:11px;color:#94a3b8;">
            Email này được gửi tự động từ website
            <a href="https://wonmedia.vn" style="color:#6366F1;text-decoration:none;">wonmedia.vn</a>
          </p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`

    const payload = {
      from: `WON Media <${fromEmail}>`,
      to: [toEmail],
      replyTo: data.email,
      subject: `[WON Media] Tin nhắn mới: ${data.subject}`,
      html,
    }

    // Thử gửi tối đa 3 lần với backoff 500ms, 1000ms
    let lastError: string | undefined
    for (let attempt = 0; attempt < 3; attempt++) {
      if (attempt > 0) await new Promise(r => setTimeout(r, 500 * attempt))
      const { error } = await resend.emails.send(payload)
      if (!error) return { ok: true }
      lastError = error.message
      console.warn(`[email] Attempt ${attempt + 1} failed: ${error.message}`)
    }

    console.error('[email] sendContactNotification failed after 3 attempts:', lastError)
    return { ok: false, reason: lastError }
  } catch (err) {
    console.error('[email] sendContactNotification unexpected error:', err)
    return { ok: false, reason: String(err) }
  }
}
