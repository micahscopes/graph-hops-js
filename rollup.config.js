// Rollup plugins
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
var pkg = require('./package.json');

export default {
  entry: 'index.js',
  acorn: {
    allowReserved: true
  },
  targets: [
    {
      dest: pkg.main,
      format: 'umd',
      moduleName: 'graphHops',
      sourceMap: true
    },
    {
      dest: pkg.module,
      format: 'es',
      sourceMap: true
    }
  ],
  // sourceMap: 'inline',
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      browser: true,
      preferBuiltins: true  // Default: true
    }),
    commonjs(),
    babel({
      presets: [
        ['es2015', { modules: false }],
      ],
      plugins: [
        // 'transform-class-properties',
        'external-helpers',
        // 'transform-runtime'
      ],
      exclude: 'node_modules/babel-runtime/**',
    //   externalHelpers: true,
    }),
  ],
};
