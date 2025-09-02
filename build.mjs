import { build } from 'esbuild'
import { existsSync, rmSync } from 'fs'

const isProduction = process.env.NODE_ENV === 'production'
const isWatch = process.argv.includes('--watch')

// Clean dist directory
if (existsSync('dist')) {
  rmSync('dist', { recursive: true, force: true })
}

const baseConfig = {
  entryPoints: ['src/extension.ts'],
  bundle: true,
  outdir: 'dist',
  external: ['vscode'],
  format: 'cjs',
  platform: 'node',
  target: 'es2020',
  sourcemap: true,
  minify: isProduction,
  keepNames: true,
  tsconfig: './tsconfig.json',
  logLevel: 'info'
}

if (isWatch) {
  // Watch mode
  const ctx = await build({
    ...baseConfig,
    watch: {
      onRebuild(error, result) {
        if (error) {
          console.error('❌ Build failed:', error)
        } else {
          console.log('✅ Build succeeded')
        }
      }
    }
  })
  console.log('👀 Watching for changes...')
} else {
  // Build mode
  try {
    await build(baseConfig)
    console.log('✅ Build completed successfully')
  } catch (error) {
    console.error('❌ Build failed:', error)
    process.exit(1)
  }
}
