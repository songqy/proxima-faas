import { rollup, OutputOptions } from 'rollup';
import path from 'path';
import esbuild from 'rollup-plugin-esbuild';

const inputOptions = {
  input: path.resolve('codes/index.ts'),
  plugins: [
    esbuild({
      include: /\.[jt]sx?$/, // default, inferred from `loaders` option
      exclude: /node_modules/, // default
      sourceMap: true, // by default inferred from rollup's `output.sourcemap` option
      minify: process.env.NODE_ENV === 'production',
      target: 'es2017', // default, or 'es20XX', 'esnext'
      jsx: 'transform', // default, or 'preserve'
      jsxFactory: 'Px.createElement',
      jsxFragment: 'Px.Fragment',
    }),
  ],
};

const outputOptions: OutputOptions = {
  file: path.resolve('output/index.js'),
  format: 'es',
  sourcemap: true,
};

async function build() {
  const bundle = await rollup(inputOptions);
  await bundle.write(outputOptions);
}

export default build;
