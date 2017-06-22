var webpack = require('webpack');
var autoprefixer = require('autoprefixer');

module.exports = {
  entry: "./js/main.js",
  output: {
    filename: "./js/bundle.js"
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'eslint-loader'
    }, {
      test: /\.css$/,
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader',
        options: {
          url: false
        }
      }, {
        loader: 'postcss-loader'
      }],
    }],
    loaders: [
      //.js 文件使用 jsx-loader 来编译处理
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }, {
      test: /\.less$/,
      loader: 'style!css!less'
    }, {
      test: /\.css$/,
      loader: 'style!css!less'
    }
    ]
  },

  resolve: {
    extensions: ['.js']
  },
  plugins: [new webpack.LoaderOptionsPlugin({
    options: {
      postcss: [
        autoprefixer(),
      ]
    }
  })]
};

