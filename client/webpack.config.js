const path = require('path');
const webpack = require('webpack');


const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PRODUCTION = false;
const DIST_FOLDER = '../server/public' ;

module.exports = {
   entry: {
   'user' : path.resolve(__dirname, 'src', 'scripts', 'user.js'),
    'admin' : path.resolve(__dirname, 'src', 'scripts', 'admin.js')
    },

  output: {
    path: path.resolve(__dirname, DIST_FOLDER),
    filename: 'scripts/[name]-bundle.js'
  },

  mode :  (PRODUCTION ? 'production' : 'development'),
  devtool : (PRODUCTION ? undefined : 'source-map'),

  devServer: {
      static: {
	       publicPath: path.resolve(__dirname, DIST_FOLDER),
	       watch : true
      },
      host : 'localhost',
      port : 9000,
      open : true
  },

  module: {
    rules: [
      {
        test: /\.(m?js$|jsx)/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|gif)/i,
        use: {
          loader: 'file-loader',
          options: {
            name : '[name].[ext]',
            outputPath : 'images'
          }
        }
      }
    ]
  },

  plugins: [
      new webpack.ProgressPlugin(),
      new HtmlWebpackPlugin({
	       template: path.resolve(__dirname,'src', 'showtime-app.html'),
	        filename: './showtime-app.html',
          chunks : ['user'],
	        hash: true,
      }),
      new HtmlWebpackPlugin({
	       template: path.resolve(__dirname,'src', 'showtime-app-admin.html'),
	        filename: './showtime-app-admin.html',
          chunks : ['admin'],
	        hash: true,
      }),
      new CopyPlugin({
          patterns: [
            {    
              context: path.resolve(__dirname, 'src', 'html'),
              from: "**/*.html",
              to:  'html',
              noErrorOnMissing: true,
              globOptions: {
              ignore:[] }
            },
             {
       		from: 'src/style/*',
       		to:   'style/[name][ext]',
       		noErrorOnMissing: true
        },
            {
              context: path.resolve(__dirname, "vendor"),
              from: "**/*.js",
              globOptions: { },
              noErrorOnMissing: true,
              to:  'vendor'
            }
         ]
       }),
     ],


  /* en cas de gestion de bibliothèques externes à exclure du bundle, ici cas de React pour l'exemple */
  externals : {
    react: 'React',
    reactdom: 'ReactDom',
  },

/*
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()]
  }
  */
}
