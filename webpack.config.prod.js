/**
 * Created by panfei on 2016/11/7.
 */
//����webpack
var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin'); //�Զ�����html���
var ExtractTextPlugin = require("extract-text-webpack-plugin"); //��ȡ��ʽ���

//�����ַ
var node_modules = path.resolve(__dirname, 'node_modules');
var pathToReact = path.resolve(node_modules, 'react/dist/react.min.js');
var APP_PATH = path.resolve(__dirname, 'src'); //__dirname�е�srcĿ¼���Դ�����

module.exports = {
   //ҳ������ļ�����
    entry: {
        app: ['./src/js/index.js'],
        vendors: ['jquery', 'react'] //��Ҫ����ĵ��������
    },

    //����ļ��������
    output: {
        path: path.resolve(__dirname, './dist'),  //���뵽��ǰĿ¼
        publicPath: './',  //����õ��ļ����ڷ�������·��,���Ǿ�̬��Դ����·��
        filename: 'bundle_[name].js'  //�������ļ�����
    },
    module: {
        noParse: [pathToReact], //�������ģ�鲻��Ҫparse��������
        noParse: [pathToReact], //�������ģ�鲻��Ҫparse��������
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
            //ע������Ǹ�limit�Ĳ���������ͼƬ��СС��������Ƶ�ʱ�򣬻��Զ�����base64����ͼƬ
            include: [APP_PATH]
        }
        ]
    },
    //������صı����������Ժ�ʹ��
    resolve: {
        extensions: ['', '.js', '.jsx'],
        alias:{
            jquery: path.resolve(__dirname, 'lib/jquery-2.1.4.min.js')
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production") //������뻷��
            }
        }),
        //��ȡ����������Դ
        new webpack.optimize.CommonsChunkPlugin({
            //��entry�е�vendors��Ӧ
            name: 'vendors',
            //����Ĺ�����Դ����
            filename: 'common.bundle.js',
            //������entryʵ���������
            minChunks: Infinity
        }),
        //����ѹ������
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),

        //��jquery��Ϊȫ�ֱ������뵽���д����У��Ϳ���ֱ����ҳ����ʹ��jQuery��
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }),
        //����index.htmlҳ��
        new HtmlWebpackPlugin({
            title: 'webpack demo',  //����title������
            filename: 'index.html',   //�������html���ļ���
            template: 'indexTem.html', //Ҫʹ�õ�ģ���·��
            inject: 'body', //��ģ��ע�뵽�ĸ���ǩ��
            minify: false, //�Ƿ�ѹ��
            hash: true, //�Ƿ�hash��
            cache: false, //�Ƿ񻺴�
            showErrors: false //�Ƿ���ʾ����
        }),
        //����css
        new ExtractTextPlugin('[name].bundle.css',{
            allChunks: true
        }),
        new webpack.NoErrorsPlugin()
    ],
    resolve: {
        extensions: ['', '.js', '.jsx', '.less', '.css'] //��׺���Զ���ȫ
    }
};
