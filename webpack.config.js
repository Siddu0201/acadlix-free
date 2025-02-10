const defaultConfig = require("./node_modules/@wordpress/scripts/config/webpack.config");

const path = require("path");
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  ...defaultConfig,

  entry: {
    ...defaultConfig.entry,

    admin_home: path.resolve(process.cwd(), "src", "admin-home.js"),
    admin_course: path.resolve(process.cwd(), "src", "admin-course.js"),
    admin_lesson: path.resolve(process.cwd(), "src", "admin-lesson.js"),
    admin_quiz: path.resolve(process.cwd(), "src", "admin-quiz.js"),
    admin_order: path.resolve(process.cwd(), "src", "admin-order.js"),
    admin_setting: path.resolve(process.cwd(), "src", "admin-setting.js"),
    admin_tool: path.resolve(process.cwd(), "src", "admin-tool.js"),

    front: path.resolve(process.cwd(), "src", "front.js"),
    front_checkout: path.resolve(process.cwd(), "src", "front-checkout.js"),
    front_single_course: path.resolve(process.cwd(), "src", "front-single-course.js"),
  },

  output: {
    ...defaultConfig.output,
    // chunkFilename: '[name].bundle.js'
    filename: "[name].js",
    chunkFilename: "[name].[contenthash].bundle.js",
    path: path.resolve(process.cwd(), "build"),
  },

  optimization: {
    ...defaultConfig.optimization,
    runtimeChunk: "single",
    splitChunks: {
      chunks: "all", // Apply splitting to all chunks
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/, // Extract dependencies from node_modules
          name: "vendors",
          chunks: "all",
          priority: -10,
        },
        default: false
      },
    },
  },

  devServer: {
    ...defaultConfig.devServer,
    hot: true,
    watchFiles: ["src/**/*"],
    liveReload: false,
    proxy: [
      {
        context: ['/api'],
        target: 'http://localhost:3000',
      },
    ],
  },
  plugins: [
    ...defaultConfig.plugins,
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'static', // Generate a report.html file
    //   openAnalyzer: false,
    // }),
  ],
};
