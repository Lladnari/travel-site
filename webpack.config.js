const path = require('path')

const postCSSPlugins = [
    require('postcss-hexrgba'),
    require('postcss-import'),
    require('postcss-mixins'),
    require('postcss-simple-vars'),
    require('postcss-nested'),
    require('autoprefixer')
]

module.exports = {
    entry: './app/assets/scripts/App.js',
    output: {
        filename: 'bundled.js',
        path: path.resolve(__dirname, 'app')
    },
    devServer: {
        before: function (app, server){ // auto update browser URL of localhost:<<port>> upon changes to *.html files.
            server._watch('./app/**/*.html')
        },
        contentBase: path.join(__dirname, 'app'),
        hot: true, // inject css and js.
        port: 3000, // 8080 by default.
        host: '0.0.0.0' // allow devices on same network to access WebPack-Dev-Server from this computer.
    },
    mode: 'development',
    watch: false, // not needed due to devServer.
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    'style-loader', 
                    'css-loader?url=false', // css-loader attempts to handle any images. Disable this so we can manage images manually.
                    {
                        loader: 'postcss-loader', 
                        options: {
                            postcssOptions: {
                                plugins: postCSSPlugins
                            }
                        }
                    }
                ]
            }
        ]
    }
}