// In-process flag — ngăn seed chạy nhiều lần khi hot-reload trong dev
let seeded = false

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs' && !seeded) {
    seeded = true
    const { runSeed } = await import('./lib/seed')
    await runSeed()
  }
}
