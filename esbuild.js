const esbuild = require('esbuild');

const opts = {
        entryPoints: ['index.js'],
        bundle: true,
        sourcemap: true,
        minify: true,
        target: ['esnext']
    }

let results
// IIFE
esbuild
    .build({
        ...opts,
        outdir: 'dist/iife',
    })
//    .catch(() => process.exit(1));

// esm
esbuild
    .build({
        ...opts,
        format: 'esm',
        outdir: 'dist/esm',
    })
//   .catch(() => process.exit(1));

// CommonJS
esbuild
    .build({
        ...opts,
        platform: 'node',
        target: ['node10.4'],        
        outdir: 'dist/cjs',
    })
//  .catch(() => process.exit(1));


