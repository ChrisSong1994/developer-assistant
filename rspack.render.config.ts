import { Configuration } from '@rspack/cli';
import { rspack } from '@rspack/core';
import RefreshPlugin from '@rspack/plugin-react-refresh';
import path from 'path';

const isDev = process.env.NODE_ENV === 'development';

const config: Configuration = {
  mode: isDev ? 'development' : 'production',
  entry: {
    index: path.resolve(__dirname, './src/renderer/index.tsx'),
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  },
  resolve: {
    extensions: ['...', '.ts', '.tsx', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src', 'renderer'),
    },
  },
  devServer: {
    port: 3000,
    open: false,
    historyApiFallback: false,
  },
  module: {
    parser: {
      'css/auto': {
        namedExports: false,
      },
    },
    rules: [
      {
        test: /\.(jsx?|tsx?)$/,
        use: [
          {
            loader: 'builtin:swc-loader',
            options: {
              jsc: {
                parser: {
                  syntax: 'typescript',
                  tsx: true,
                },
                transform: {
                  react: {
                    runtime: 'automatic',
                  },
                },
              },
            },
          },
        ],
      },
      {
        test: /\.less$/,
        loader: require.resolve('less-loader'),
        options: {
          lessOptions: {
            javascriptEnabled: true,
          },
        },
        type: 'css/auto',
      },
      {
        test: /\.(png|svg|webp|jpe?g|gif)(\?.*)?$/i,
        type: 'asset',
        generator: {
          filename: 'assets/[hash][ext]',
        },
      },
      {
        test: /.(md|txt)$/,
        type: 'asset/source',
      },
    ],
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: path.resolve(__dirname, './src/renderer/index.html'),
    }),
    new rspack.ProgressPlugin({}),
    new rspack.CopyRspackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, './src/renderer/public'),
          to: path.resolve(__dirname, './build'),
        },
      ],
    }),
    isDev ? new RefreshPlugin() : null,
  ].filter(Boolean),

  experiments: {
    css: true,
  },
};
export = config;
