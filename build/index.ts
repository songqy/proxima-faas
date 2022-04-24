import { rollup, OutputOptions, Plugin, RollupOptions } from 'rollup';
import path from 'path';
import esbuild from 'rollup-plugin-esbuild';
import typescript from 'rollup-plugin-typescript2';

enum MODE {
  DEV = 'dev',
  PROD = 'prod',
}

function getRollupOptions(mode: MODE) {
  const plugins: Plugin[] = [];
  if (mode === MODE.DEV) {
    plugins.push(
      typescript({
        tsconfigOverride: {
          compilerOptions: {
            module: 'es2015',
            target: 'es2017',
            jsx: 'react',
            jsxFactory: 'Px.createElement',
            jsxFragmentFactory: 'Px.Fragment',
          },
          exclude: ['node_modules'],
        },
      }),
      // terser(),
    );
  } else {
    plugins.push(
      esbuild({
        // esbuild会导致sourcemap有问题
        include: /\.[jt]sx?$/, // default, inferred from `loaders` option
        exclude: /node_modules/, // default
        // sourceMap: true, // by default inferred from rollup's `output.sourcemap` option
        minify: true,
        target: 'es2017', // default, or 'es20XX', 'esnext'
        jsx: 'transform', // default, or 'preserve'
        jsxFactory: 'Px.createElement',
        jsxFragment: 'Px.Fragment',
      }),
    );
  }
  const inputOptions: RollupOptions = {
    input: path.resolve('codes/index.ts'),
    plugins,
  };

  const outputOptions: OutputOptions = {
    file: path.resolve('output/index.js'),
    format: 'es',
    sourcemap: mode === MODE.DEV,
  };
  return { inputOptions, outputOptions };
}

async function build() {
  const startTime = Date.now();
  const { inputOptions, outputOptions } = getRollupOptions(MODE.DEV);
  const bundle = await rollup(inputOptions);
  await bundle.write(outputOptions);
  // const { output } = await bundle.generate(outputOptions);
  // console.log('output', output);
  const endTime = Date.now();
  console.log(`build success,cost ${endTime - startTime}ms`);
}

export default build;
