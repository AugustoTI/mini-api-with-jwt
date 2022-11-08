const esbuild = require('esbuild')

esbuild.buildSync({
  platform: 'node',
  entryPoints: ['backend/index.ts'],
  minify: true,
  bundle: true,
  keepNames: true,
  outfile: 'dist/index.js',
  sourcemap: true,
  target: ['node18'],
  external: ['node_modules'],
})
