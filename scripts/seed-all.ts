import { config } from 'dotenv'
config({ path: '.env.local' })

import { runSeed } from '../lib/seed'

runSeed()
  .then(() => { console.log('\n✅ Seed hoàn tất!'); process.exit(0) })
  .catch(e => { console.error('[seed-all] Lỗi:', e); process.exit(1) })
