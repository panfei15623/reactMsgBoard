/**
 * Created by panfei on 2016/11/7.
 */
//导入webpack
var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin'); //自动生成html插件
var ExtractTextPlugin = require("extract-text-webpack-plugin"); //提取样式插件

//定义地址
var node_modules = path.resolve(__dirname, 'node_modules');
var pathToReact = path.resolve(node_modules, 'react/dist/react.min.js');
var APP_PATH = path.resolve(__dirname, 'src'); //__dirname中的src目录，以此类推

module.exports = {
   //页面入口文件配置
    entry: {
        app: ['./src/js/index.js'],
        vendors: ['jquery', 'react'] //需要打包的第三方插件
    },

    //入口文件输出配置
    output: {
        path: path.resolve(__dirname, './dist'),  //编译到当前目录
        publicPath: './',  //编译好的文件，在服务器的路径,这是静态资源引用路径
        filename: 'bundle_[name].js'  //编译后的文件名字
    },
    module: {
        noParse: [pathToReact], //声明这个模块不需要parse查找依赖
        noParse: [pathToReact], //声明这个模块不需要parse查找依赖
        loaders: [{
            test: /\.js|jsx$/,
            exclude: /node_modules/,
            loaders: ['babel?presets[]=es2015,presets[]=react,presets[]=stage-0'],
            include: [APP_PATH]
        }, {
            test: /\.css$/,
            exclude: /^node_modules$/,
            loader: ExtractTextPlugin.extract('style', 'css'),
            include: [APP_PATH]
        }, {
            test: /\.less$/,
            exclude: /^node_modules$/,
            loader: ExtractTextPlugin.extract('style', 'css!less'),
            include: [APP_PATH]
        }, {
            test: /\.(eot|woff|svg|ttf|woff2|gif|appcache)(\?|$)/,
            exclude: /^node_modules$/,
            loader: 'file-loader?name=[name].[ext]',
            include: [APP_PATH]
        }, {
            test: /\.(png|jpg|gif)$/,
            exclude: /^node_modules$/,
            loader: 'url-loader?limit=8192&name=images/[hash:8].[name].[ext]',
            //注意后面那个limit的参数，当你图片大小小于这个限制的时候，会自动启用base64编码图片
            include: [APP_PATH]
        }
        ]
    },
    //定义相关的别名，方便以后使用
    resolve: {
        extensions: ['', '.js', '.jsx'],
        alias:{
            jquery: path.resolve(__dirname, 'lib/jquery-2.1.4.min.js')
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production") //定义编译环境
            }
        }),
        //提取公共部分资源
        new webpack.optimize.CommonsChunkPlugin({
            //与entry中的vendors对应
            name: 'vendors',
            //输出的公共资源名称
            filename: 'common.bundle.js',
            //对所有entry实行这个规则
            minChunks: Infinity
        }),
        //代码压缩混淆
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),

        //把jquery作为全局变量插入到所有代码中，就可以直接在页面中使用jQuery了
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }),
        //生成index.html页面
        new HtmlWebpackPlugin({
            title: 'webpack demo',  //设置title的名字
            filename: 'index.html',   //设置这个html的文件名
            template: 'indexTem.html', //要使用的模块的路径
            inject: 'body', //把模板注入到哪个标签后
            minify: false, //是否压缩
            hash: true, //是否hash化
            cache: false, //是否缓存
            showErrors: false //是否显示错误
        }),
        //分离css
        new ExtractTextPlugin('[name].bundle.css',{
            allChunks: true
        }),
        new webpack.NoErrorsPlugin()
    ],
    resolve: {
        extensions: ['', '.js', '.jsx', '.less', '.css'] //后缀名自动补全
    }
};
