const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const path = require('path');

module.exports = {
    entry: {
        lib: path.resolve(__dirname, 'src/lib/index.js'),
        app: path.resolve(__dirname, 'src/app/index.js')
    },
    target: 'web',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    devServer: {
        compress: true,
        host: '0.0.0.0',
        port: 3000
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                include: [
                    path.resolve(__dirname, "src/app")
                ],
                use: ['babel-loader']
            },
            {
                test: /lib\/index\.js/,
                exclude: [
                    /node_modules/,
                    path.resolve(__dirname, "src/app")
                ],
                use: [{
                    loader: 'expose-loader',
                    options: 'FollowersChart'
                }]
            },
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
            },
            {
                test: /\.md/i,
                use: 'raw-loader',
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            path: path.resolve(__dirname, 'dist'),
            template: path.resolve(__dirname, 'src/app/index.html'),
            favicon: path.resolve(__dirname, 'src/app/resources/favicon.png'),
            filename: 'index.html',
            inject: 'body',
            minify: true
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css'
        }),
        new OptimizeCSSAssetsPlugin({})
    ]
};
