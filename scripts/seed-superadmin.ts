import mongoose from 'mongoose'
import { existsSync } from 'fs'
import { resolve } from 'path'

const envFile = resolve(process.cwd(), '.env.local')
if (existsSync(envFile)) process.loadEnvFile(envFile)

import { runSeed } from '../lib/seed'

runSeed()
  .then(() => console.log('[seed] Done.'))
  .catch(console.error)
  .finally(() => mongoose.disconnect().then(() => process.exit(0)))

