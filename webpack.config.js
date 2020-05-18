const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const path = require('path');

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

module.exports = {
  entry: {
    bundle: ['./src/main.js']
  },
  devServer: {
    port: 3000
  },
  resolve: {
    alias: {
      svelte: path.resolve('node_modules', 'svelte')
    },
    extensions: ['.mjs', '.js', '.svelte'],
    mainFields: ['svelte', 'browser', 'module', 'main']
  },
  output: {
    path: __dirname + '/public',
    filename: '[name].js',
    chunkFilename: '[name].[id].js'
  },
  // optimization: {
  //   minimize: true,
  //   minimizer: [
  //     new TerserPlugin({
  //       terserOptions: {
  //         ecma: undefined,
  //         warnings: false,
  //         parse: {},
  //         compress: {},
  //         mangle: true, // Note `mangle.properties` is `false` by default.
  //         module: false,
  //         output: null,
  //         toplevel: false,
  //         nameCache: null,
  //         ie8: false,
  //         keep_classnames: undefined,
  //         keep_fnames: false,
  //         safari10: false,
  //       },
  //       extractComments: 'all'
  //     }),
  //   ],
  // },
  module: {
    rules: [{
        test: /\.scss$/,
        use: [
          'style-loader', 'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: [
                  './src/theme',
                  './theme',
                  './node_modules'
                ]
              }
            }
          }
        ]
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        use: [{
          loader: "html-loader",
          options: {
            minimize: true
          }
        }]
      }, {
        test: /\.svelte$/,
        use: {
          loader: 'svelte-loader',
          options: {
            emitCss: true,
            hotReload: true
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          /**
           * MiniCssExtractPlugin doesn't support HMR.
           * For developing, use 'style-loader' instead.
           * */
          prod ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  mode,
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ],
  devtool: prod ? false : 'source-map'
};