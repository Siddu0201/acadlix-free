const defaultConfig = require("./node_modules/@wordpress/scripts/config/webpack.config");

const path = require("path");

module.exports = {
  ...defaultConfig,

  entry: {
    ...defaultConfig.entry,

    index: path.resolve(process.cwd(), "src", "index.js"),

    front: path.resolve(process.cwd(), "src", "front.js"),
  },

  output: {
    ...defaultConfig.output,
    // chunkFilename: '[name].bundle.js'
  },  

  optimization: {
    ...defaultConfig.optimization,
    
    // splitChunks: {
    //   chunks: 'all',
    // },
  },

  devServer: {
    ...defaultConfig.devServer,
    
    proxy: [
      {
        context: ['/api'],
        target: 'http://localhost:3000',
      },
    ],
  },
};
