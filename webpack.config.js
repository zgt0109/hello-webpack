const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

const bootstrapEntryPoints = require('./webpack.bootstrap.config')

let pathsToClean = [
  'dist',
]

var isProd = process.env.NODE_ENV === 'production'; // true or false
var cssDev = ['style-loader', 'css-loader', 'sass-loader'];
var cssProd = ExtractTextPlugin.extract({
  fallback: 'style-loader',
  //resolve-url-loader may be chained before sass-loader if necessary
  use: ['css-loader', 'sass-loader']
})

var cssConfig = isProd ? cssProd : cssDev;
var bootstrapConfig = isProd ? bootstrapEntryPoints.prod : bootstrapEntryPoints.dev;

module.exports = {
		entry: {
			"app.bundle": './src/app.js',
			"contact": './src/contact.js',
			"bootstrap": bootstrapConfig
		},
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: '[name].[hash].js'
			},
		devServer: {
			contentBase: './dist',
			host: '0.0.0.0',
			port: 9000,
			open: true,
			hot: true
		},
		plugins: 
		[
			new CleanWebpackPlugin(pathsToClean),
			new HtmlWebpackPlugin({
				template: './src/index.html',
				filename: 'index.html',
				minify: {
					collapseWhitespace: true
				},
				hash: true,
				excludeChunks: ['contact']
			}),
			new HtmlWebpackPlugin({
				template: './src/contact.html',
				filename: 'contact.html',
				minify: {
					collapseWhitespace: true
				},
				hash: true,
				chunks: ['contact']
			}),
			new ExtractTextPlugin({
				filename: '[name].css',
				disable: !isProd,
				publicPath: 'css/'
			}),
			// 这两行是新增的
			new webpack.NamedModulesPlugin(),
			new webpack.HotModuleReplacementPlugin()
		],
		module: {
			rules:[
				{
					test: /\.(css|scss)$/,
					use: cssConfig
				},
				{
					test: /\.(gif|png|jpe?g|svg)$/i,
					use:
					[
						{
						  loader: 'file-loader',
						  options: {
							name: '[name].[ext]',
							outputPath: 'images/'
						  }
						},
						{
							loader: 'image-webpack-loader',
							options: {
								bypassOnDebug: true,
							}
						}
					]
				},
				// 下面几行才是 html-loader 的配置内容
				{
					test: /\.html$/,
					use: [ {
					loader: 'html-loader',
					options: {
						minimize: true
					}
					}],
				},
				// 这两行是处理 react 相关的内容
				{ test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
				{ test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ },
				{ test: /\.pug$/, loader: ['raw-loader', 'pug-html-loader'] },

				// 字体文件都放到 fonts 目录中
				{ test: /\.(woff2?|svg)$/, loader: 'url-loader?limit=10000&name=[name].[ext]&outputPath=fonts/' },
				{ test: /\.(ttf|eot)$/, loader: 'file-loader?name=[name].[ext]&outputPath=fonts/' },

				{ test:/bootstrap-sass[\/\\]assets[\/\\]javascripts[\/\\]/, loader: 'imports-loader?jQuery=jquery' },
			]
		}
  };