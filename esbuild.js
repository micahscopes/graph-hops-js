import esbuild from 'esbuild';

const opts = {
        entryPoints: ['index.js'],
        bundle: true,
        sourcemap: true,
        minify: true,
        target: ['esnext']
    }

// IIFE
esbuild
    .build({
        ...opts,
        outdir: 'dist/iife',
    })

// esm
esbuild
    .build({
        ...opts,
        format: 'esm',
        outdir: 'dist/esm',
    })

// CommonJS
esbuild
    .build({
        ...opts,
        platform: 'node',
        target: ['node10.4'],
        outdir: 'dist/cjs',
    })


