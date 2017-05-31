module.exports = {
  entry: './src/main.js',
  output: {
    path: __dirname + './src',
    filename: 'bundle.js',
  },
  devServer: {
    inline:true,
    contentBase: './src',
    port: 8081
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          plugins: ['transform-runtime'],
          presets: ['es2015', 'stage-0', 'react'],
        }
      }
    ]
  }
}
