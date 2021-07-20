const currentTask = process.env.npm_lifecycle_event // dev or build.
const path = require('path')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const fsExtra = require('fs-extra')

const postCSSPlugins = [
    require('postcss-hexrgba'),
    require('postcss-import'),
    require('postcss-mixins'),
    require('postcss-simple-vars'),
    require('postcss-nested'),
    require('autoprefixer')
]

let sPublicFolderName = "docs"; // docs is required for publishing on github.

class RunAfterCompile{
    apply(compiler) {
        compiler.hooks.done.tap('Copy images', function() {
            fsExtra.copySync('./app/assets/images', './' + sPublicFolderName + '/assets/images')
        })
    }
}

let cssConfig = {
    test: /\.css$/i,
    use: [
        //'style-loader', 
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

// Multiple HTML files.
let aHTMLPages = fsExtra.readdirSync('./app').filter(function(file) {
    return file.endsWith('.html')
}).map(function(page) {
    return new HtmlWebpackPlugin({
        filename: page,
        template: `./app/${page}`
    })
})

let config = {
    entry: './app/assets/scripts/App.js',
    plugins: aHTMLPages,
    module: {
        rules: [
            cssConfig,
            { // configure js to work with older browsers.
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-react', '@babel/preset-env']
                    }
                }
            }
        ]
    }
}

if (currentTask == "dev") {
    config.mode = 'development'
    cssConfig.use.unshift('style-loader')
    config.output = {
        filename: 'bundled.js',
        path: path.resolve(__dirname, 'app')
    }
    config.devServer = {
        before: function (app, server){ // auto update browser URL of localhost:<<port>> upon changes to *.html files.
            server._watch('./app/**/*.html')
        },
        contentBase: path.join(__dirname, 'app'),
        hot: true, // inject css and js.
        port: 3000, // 8080 by default.
        host: '0.0.0.0' // allow devices on same network to access WebPack-Dev-Server from this computer.
    }
    //config.watch = false; // not needed due to devServer.
}

// How name vendors-main.*.js file?
if (currentTask == "build") {
    config.mode = 'production'
    //config.module.rules.push()
    cssConfig.use.unshift(MiniCssExtractPlugin.loader)
    config.output = {
        filename: '[name].[chunkhash].js', // Replaced bundled with [name] due to error.  Add a hash # to force reload.
        chunkFilename: '[name].[chunkhash].js', // ???
        path: path.resolve(__dirname, sPublicFolderName)
    }
    config.optimization = {
        splitChunks: {chunks: "all", minSize: 1000},    // main.js, modal.js, vendor.js = Should breakout vendor code (lazysizes, lodash (throttle, debounce))?
        minimize: true,
        minimizer: [`...`, new CssMinimizerPlugin()] // `...` = use default WebPack minimizer.
    }
    config.plugins.push(
        new CleanWebpackPlugin(),   // delete any file being replaced.
        new MiniCssExtractPlugin({filename: "styles.[chunkhash].css"}),  // Extract css into separate file.
        new RunAfterCompile()
        )
}

module.exports = config;
