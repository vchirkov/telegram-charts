const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    devtool: 'source-map', // more info:https://webpack.js.org/guides/development/#using-source-maps and https://webpack.js.org/configuration/devtool/
    entry: [path.resolve(__dirname, 'src/index.js')],
    target: 'web',
    output: {
        path: path.resolve(__dirname, 'dist'), // Note: Physical files are only output by the production build task `npm run build`.
        publicPath: '/',
        filename: 'index.js'
    },
    devServer: {
        contentBase: path.join(__dirname, 'assets'),
        compress: true,
        port: 3000
    },
    plugins: [
        new HtmlWebpackPlugin({     // Create HTML file that includes references to bundled CSS and JS.
            path: path.resolve(__dirname, 'dist'),
            title: 'Telegram Charts',
            filename: 'index.html',
            favicon: 'assets/favicon.svg',
            inject: 'body',
            minify: true
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            mimetype: 'image/svg+xml'
                        }
                    }
                ]
            },
            {
                test: /\.less$/,
                use: [{
                    loader: 'style-loader' // creates style nodes from JS strings
                }, {
                    loader: 'css-loader' // translates CSS into CommonJS
                }, {
                    loader: 'less-loader' // compiles Less to CSS
                }]
            }
        ]
    }
};
