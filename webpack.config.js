const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const path = require('path');

module.exports = {
    devtool: 'source-map',
    entry: [path.resolve(__dirname, 'src/index.js')],
    target: 'web',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js'
    },
    devServer: {
        contentBase: path.join(__dirname, 'assets'),
        compress: true,
        port: 3000
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /\.svg/,
                use: {
                    loader: 'svg-url-loader'
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            path: path.resolve(__dirname, 'dist'),
            template: path.resolve(__dirname, './src/index.html'),
            title: 'Telegram Charts',
            filename: 'index.html',
            favicon: 'assets/favicon.svg',
            inject: 'body',
            minify: true
        }),
        new MiniCssExtractPlugin({
            filename: 'index.css'
        }),
        new OptimizeCSSAssetsPlugin({})
    ]
};
