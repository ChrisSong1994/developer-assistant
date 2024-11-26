import { Configuration } from '@rspack/cli';
import { rspack } from '@rspack/core';
import path from 'path';

const config: Configuration = {
  target: 'electron-main',
  entry: {
    main: path.resolve(__dirname, './src/main/index.ts'),
    preload: path.resolve(__dirname, './src/main/preload.ts'),
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    library: {
      type: 'commonjs',
    },
  },
  resolve: {
    extensions: ['...', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src', 'main'),
    },
  },

  module: {
    rules: [
      {
        test: /\.(js?|ts?)$/,
        use: [
          {
            loader: 'builtin:swc-loader',
            options: {
              jsc: {
                parser: {
                  syntax: 'typescript',
                },
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [new rspack.ProgressPlugin({})].filter(Boolean),
};
export = config;
