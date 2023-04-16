const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PRODUCTION = false;
const DIST_FOLDER = 'dist';

module.exports = {
   entry: path.resolve(__dirname, 'src', 'scripts', 'main.js'),

   output: {
      path: path.resolve(__dirname, DIST_FOLDER),
      filename: 'scripts/bundle.js'
   },

   mode: (PRODUCTION ? 'production' : 'development'),
   devtool: (PRODUCTION ? undefined : 'eval-source-map'),

   devServer: {
      static: {
         publicPath: path.resolve(__dirname, DIST_FOLDER),
         watch: true
      },
      host: 'localhost',
      port: 9000,
      open: true
   },

   module: {
      rules: [
         {
            test: /\.(m?js$|jsx)/,
            exclude: /(node_modules)/,
            use: {
               loader: 'babel-loader',
               options: {
                  presets: [
                     '@babel/preset-env',
                     '@babel/preset-react'
                  ],
                  plugins: [
                     '@babel/transform-runtime'
                  ]
               }
            },

         },
         {
            test: /\.mp3$/i,
            use: {
               loader: 'file-loader',
               options: {
                  options: {
                     name: '[name].[ext]',
                     outputPath: 'sounds'
                  }
               }
            },

         },
         {
            test: /\.css$/i,
            use: ['style-loader', 'css-loader'],
         },
         {
            test: /\.(png|jpg|gif)/i,
            use: {
               loader: 'file-loader',
               options: {
                  name: '[name].[ext]',
                  outputPath: 'images'
               }
            }
         }
      ]
   },

   plugins: [
      new webpack.ProgressPlugin(),
      new HtmlWebpackPlugin({
         template: path.resolve(__dirname, 'src', 'index.html'),
         filename: './index.html',
         hash: true,
      }),
      new CopyPlugin({
         patterns: [
            {
               context: path.resolve(__dirname, 'src', 'html'),
               from: "**/*.html",
               to: 'html',
               noErrorOnMissing: true,
               globOptions: {}
            },
            {
               context: path.resolve(__dirname, 'src', 'images'),
               from: '**/*',
               to: 'images/[name][ext]',
               noErrorOnMissing: true,
            },
            {
               context: path.resolve(__dirname, 'src', 'sounds'),
               from: '**/*.mp3',
               to: 'sounds/[name][ext]',
               noErrorOnMissing: true,
            },
            {
               context: path.resolve(__dirname, 'src', 'style'),
               from: '**/*.css',
               to: 'style/[name][ext]',
               noErrorOnMissing: true,
            },
         ]
      }),
   ],

   // gestion de bibliothèques externes à exclure du bundle, ici cas de React
   externals: {
      react: 'React',
      reactdom: 'ReactDom'
   },

   optimization: {
      minimize: true,
      minimizer: [new TerserPlugin()]
   }
}
