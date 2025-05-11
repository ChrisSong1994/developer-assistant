import { Configuration } from '@rspack/cli';
import { rspack } from '@rspack/core';
import path from 'path';

const isDev = process.env.NODE_ENV === 'development';

console.log('process.env.NODE_ENV', process.env.NODE_ENV);

const config: Configuration = {
  name: 'main',
  target: 'electron-main',
  entry: {
    main: path.resolve(__dirname, './src/main/index.ts'),
    preload: path.resolve(__dirname, './src/main/preload.ts'),
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
    library: {
      type: 'commonjs2',
    },
  },
  resolve: {
    extensions: ['...', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  devtool: isDev ? 'source-map' : false,
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
  plugins: [
    new rspack.ProgressPlugin({}),
    new rspack.CopyRspackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, './src/main/public'),
          to: path.resolve(__dirname, 'build'),
        },
      ],
    }),
  ].filter(Boolean),
  optimization: {
    minimize: !isDev,
    mangleExports: !isDev,
    concatenateModules: !isDev, // 禁止模块合并
  },
};
export default config;
