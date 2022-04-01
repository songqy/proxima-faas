const rollup = require('rollup');
const path = require('path');
const esbuild = require('rollup-plugin-esbuild').default;

const inputOptions = {
  input: path.resolve('codes/index.js'),
  plugins: [
    esbuild({
      include: /\.[jt]sx?$/, // default, inferred from `loaders` option
      exclude: /node_modules/, // default
      sourceMap: false, // by default inferred from rollup's `output.sourcemap` option
      minify: process.env.NODE_ENV === 'production',
      target: 'es2017', // default, or 'es20XX', 'esnext'
      jsx: 'transform', // default, or 'preserve'
      jsxFactory: 'Px.createElement',
      jsxFragment: 'Px.Fragment',
    }),
  ],
};

const outputOptions = {
  file: path.resolve('output/index.js'),
  format: 'cjs',
};

async function build() {
  const bundle = await rollup.rollup(inputOptions);
  await bundle.write(outputOptions);
}

module.exports = build;
