import { rollup, OutputOptions, Plugin, RollupOptions } from 'rollup';
import path from 'path';
import fs from 'fs';
import esbuild from 'rollup-plugin-esbuild';
import typescript from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import cleanup from 'rollup-plugin-cleanup';
import { setCacheCodes } from '../src/cacheCodes';

enum MODE {
  DEV = 'development',
  PROD = 'production',
}

function getRollupOptions(mode = MODE.DEV) {
  const plugins: Plugin[] = [nodeResolve(), commonjs()];
  if (mode === MODE.DEV) {
    plugins.push(
      typescript({
        tsconfigOverride: {
          compilerOptions: {
            module: 'es2015',
            target: 'es2018',
            jsx: 'react',
            jsxFactory: 'NebulaUI.createElement',
            jsxFragmentFactory: 'NebulaUI.Fragment',
          },
          exclude: ['node_modules'],
        },
      }),
      cleanup({ comments: 'ts', extensions: ['js', 'jsx', 'ts', 'tsx'] }),
    );
  } else {
    plugins.push(
      esbuild({
        // esbuild会导致sourcemap有问题
        include: /\.[jt]sx?$/, // default, inferred from `loaders` option
        exclude: /node_modules/, // default
        // sourceMap: true, // by default inferred from rollup's `output.sourcemap` option
        minify: true,
        target: 'es2018', // default, or 'es20XX', 'esnext'
        jsx: 'transform', // default, or 'preserve'
        jsxFactory: 'NebulaUI.createElement',
        jsxFragment: 'NebulaUI.Fragment',
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
  const { inputOptions, outputOptions } = getRollupOptions(
    process.env.mode as MODE,
  );
  const bundle = await rollup(inputOptions);
  // await bundle.write(outputOptions);
  const { output } = await bundle.generate(outputOptions);
  const { code, map } = output[0];
  setCacheCodes({ code, map });

  await fs.promises.writeFile(path.resolve('output/index.js'), code);
  if (map) {
    map.sourcesContent = [];
    map.names = [];
    await fs.promises.writeFile(
      path.resolve('output/index.js.map'),
      JSON.stringify(map),
    );
  }

  const endTime = Date.now();
  console.log(`build success,cost ${endTime - startTime}ms`);
}

export default build;
