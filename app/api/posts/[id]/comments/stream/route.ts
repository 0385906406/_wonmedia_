import { NextRequest } from 'next/server'
import { eventBus } from '@/lib/event-bus'

export const dynamic = 'force-dynamic'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const encoder = new TextEncoder()

  const stream = new TransformStream()
  const writer = stream.writable.getWriter()

  const send = (data: object) => {
    try {
      writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
    } catch { /* client disconnected */ }
  }

  const handler = (payload: object) => send(payload)
  eventBus.on(`comment:${id}`, handler)

  // Ping mỗi 25s để giữ kết nối
  const pingInterval = setInterval(() => send({ type: 'ping' }), 25_000)

  req.signal.addEventListener('abort', () => {
    eventBus.off(`comment:${id}`, handler)
    clearInterval(pingInterval)
    writer.close().catch(() => {})
  })

  send({ type: 'connected' })

  return new Response(stream.readable, {
    headers: {
      'Content-Type':  'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection':    'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}
