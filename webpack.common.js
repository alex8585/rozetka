const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const dirNode = 'node_modules';
const dirApp = path.join(__dirname, 'app');
const dirStyles = path.join(__dirname, 'styles');
const dirAssets = path.join(__dirname, 'assets');
const { extendDefaultPlugins } = require("svgo");
const CopyPlugin = require("copy-webpack-plugin");
const LiveReloadPlugin = require('webpack-livereload-plugin');
const fs = require('fs')

const pages =
  fs
    .readdirSync(__dirname)
    .filter(fileName => fileName.endsWith('.ejs'))



/**
 * Webpack Configuration
 */
module.exports = (env) => {
  // Is the current build a development build
  const IS_DEV = !!env.dev;

  return {
    entry: {
      main: path.join(dirApp, 'index'),
      "style":  './index.scss',
    },

    resolve: {
      modules: [dirNode, dirApp, dirStyles, dirAssets],
    },

    plugins: [
      new LiveReloadPlugin(),
      new MiniCssExtractPlugin(),
      new webpack.DefinePlugin({ IS_DEV }),
      
      // ...pages.map(page => new HtmlWebpackPlugin({
      //    template: path.join(__dirname, page),
      //    filename: page,
      //    minify:false
      // })),

      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'index.ejs'),
        filename: 'index.html',
        title: 'Webpack Boilerplate',
        minify:  false 
      }),
      
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'categories.ejs'),
        filename: 'cats.html',
        title: 'Webpack Boilerplate',
        minify:  false 
      }),
      
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'category.ejs'),
        filename: 'cat.html',
        title: 'Webpack Boilerplate',
        minify:  false 
      }),

      
      new CopyPlugin({
        patterns: [
          { from: "img", to: "img" },
          { from: "fonts", to: "fonts" },
          { from: "assets",},
        ],
      }), 
      // new ImageMinimizerPlugin({
      //   minimizerOptions: {
      //     // Lossless optimization with custom option
      //     // Feel free to experiment with options for better result for you
      //     plugins: [
      //       ["gifsicle", { interlaced: true }],
      //       ["jpegtran", { progressive: true }],
      //       ["optipng", { optimizationLevel: 5 }],
      //       // Svgo configuration here https://github.com/svg/svgo#configuration
          
      //     ],
      //   },
      // }),
    ],

    module: {
      rules: [
        // BABEL
        {
          test: /\.m?js$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
            options: {
              compact: false,
            },
          },
        },

        // STYLES
        {
          test: /\.css$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                sourceMap: IS_DEV,
              },
            },
          ],
        },

        // CSS / SASS
        {
          test: /\.scss/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: IS_DEV,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: IS_DEV,
                sassOptions: {
                  includePaths: [dirAssets],
                  outputStyle: 'expanded',
                },
              },
            },
          ],
        },

        // IMAGES
        // {
        //   test: /\.(jpe?g|png|gif|svg)$/i,
        //   use: [{
        //     loader: 'file-loader',
        //     options: {
        //         name: '[name].[ext]',
        //         outputPath: 'img/',
        //         publicPath:'img/'
        //     }  
        //   }]
        // },

        // SVG
        {
          test: /\.svg$/,
          use: ['raw-loader'],
        },
      ],
    },

    optimization: {
      runtimeChunk: 'single',
    },
  };
};
