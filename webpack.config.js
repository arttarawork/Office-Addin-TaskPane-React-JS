const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require('webpack');

module.exports = (env, options) => {
  const dev = options.mode === "development";
  const config = {
    devtool: "source-map",
    entry: {
    vendor: [
        'react',
        'react-dom',
        'core-js',
        'office-ui-fabric-react'
    ],
    polyfill: 'babel-polyfill',
    taskpane: [
      'react-hot-loader/patch',
      './src/taskpane/index.js',
    ],
    ribbon: './src/ribbon/ribbon.js'
    },
    resolve: {
      extensions: [".ts", ".tsx", ".html", ".js"]
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          use: [
              'react-hot-loader/webpack',
              'babel-loader',
          ],
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
          use: {
              loader: 'file-loader',
              query: {
                  name: 'assets/[name].[ext]'
                }
              }  
            }   
          ]
    },    
    plugins: [
      new CleanWebpackPlugin(dev ? [] : ["dist"]),
      new CopyWebpackPlugin([
        {
          to: "taskpane.css",
          from: "./src/taskpane/taskpane.css"
        }
      ]),
      new ExtractTextPlugin('[name].[hash].css'),
      new HtmlWebpackPlugin({
        filename: "taskpane.html",
          template: './src/taskpane/taskpane.html',
          chunks: ['taskpane', 'vendor', 'polyfill']
      }),
      new HtmlWebpackPlugin({
          filename: "ribbon.html",
          template: "./src/ribbon/ribbon.html",
          chunks: ["ribbon"]
        }),
      new CopyWebpackPlugin([
          {
              from: './assets',
              ignore: ['*.scss'],
              to: 'assets',
          }
      ]),
      new webpack.ProvidePlugin({
        Promise: ["es6-promise", "Promise"]
      })
    ],
    devServer: {
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      https: {
        key: fs.readFileSync("./certs/server.key"),
        cert: fs.readFileSync("./certs/server.crt"),
        ca: fs.readFileSync("./certs/ca.crt")
      },
      port: 3000
    }
  };

  return config;
};
