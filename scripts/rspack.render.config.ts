import { Configuration } from '@rspack/cli';
import { rspack } from '@rspack/core';
import RefreshPlugin from '@rspack/plugin-react-refresh';
import path from 'path';

const isDev = process.env.NODE_ENV === 'development';
const ROOT = path.resolve(__dirname, '..');

const config: Configuration = {
  mode: isDev ? 'development' : 'production',
  entry: {
    index: path.resolve(ROOT, './src/renderer/index.tsx'),
  },
  output: {
    path: path.resolve(ROOT, 'build'),
    publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.jsx', '.mjs'],
    alias: {
      '@': path.resolve(ROOT, 'src'),
      'elkjs/lib/elk-api': 'elkjs/lib/elk-api.js', // for reaflow type module
      path: require.resolve('path-browserify'),
      'process/browser': require.resolve('process/browser'),
    },
  },
  devServer: {
    port: Number(process.env.DEV_SERVER_PORT ?? 3000),
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
      template: path.resolve(ROOT, './src/renderer/index.html'),
    }),
    new rspack.ProgressPlugin({}),
    new rspack.CopyRspackPlugin({
      patterns: [
        {
          from: path.resolve(ROOT, './src/renderer/public'),
          to: path.resolve(ROOT, './build'),
        },
      ],
    }),
    new rspack.ProvidePlugin({
      process: require.resolve('process/browser'),
      Buffer: ['buffer', 'Buffer'],
    }),
    isDev ? new RefreshPlugin() : null,
  ].filter(Boolean),

  optimization: {
    minimize: !isDev,
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },

  experiments: {
    css: true,
    asyncWebAssembly: true,
  },
};
export default config;
