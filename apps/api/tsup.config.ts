import { defineConfig } from 'tsup'

export default defineConfig({
  format: ['esm'],
  entry: ['src'],
  platform: 'node',
  splitting: false,
  sourcemap: true,
  clean: true,
  noExternal: ['@saas/auth', '@saas/env'],
  external: ['dotenv', '@/generated/prisma/client'],
})
