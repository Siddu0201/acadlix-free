const defaultConfig = require("./node_modules/@wordpress/scripts/config/webpack.config");

const path = require("path");
const fs = require("fs");
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const webpack = require('webpack');

module.exports = (env, argv) => {
  const existingDefinePlugin = defaultConfig.plugins.find(
    (plugin) => plugin.constructor.name === 'DefinePlugin'
  );
  
  if (existingDefinePlugin) {
    Object.assign(existingDefinePlugin.definitions, {
      'process.env.REACT_APP_IS_PREMIUM': JSON.stringify(process.env.REACT_APP_IS_PREMIUM || 'false'),
    });
  } else {
    defaultConfig.plugins.push(new webpack.DefinePlugin({
      'process.env.REACT_APP_IS_PREMIUM': JSON.stringify(process.env.REACT_APP_IS_PREMIUM || 'false'),
    }));
  }
  return {
    ...defaultConfig,

    resolve: {
      ...defaultConfig.resolve,
      alias: {
        ...defaultConfig.resolve.alias,
        "@admin": path.resolve(process.cwd(), "src", "admin"),
        "@components": path.resolve(process.cwd(), "src", "components"),
        "@free": path.resolve(process.cwd(), "src", "free"),
        "@front": path.resolve(process.cwd(), "src", "front"),
        "@helpers": path.resolve(process.cwd(), "src", "helpers"),
        "@images": path.resolve(process.cwd(), "src", "images"),
        "@layout": path.resolve(process.cwd(), "src", "layout"),
        "@menu": path.resolve(process.cwd(), "src", "menu"),
        "@modules": path.resolve(process.cwd(), "src", "modules"),
        "@partials": path.resolve(process.cwd(), "src", "partials"),
        "@provider": path.resolve(process.cwd(), "src", "provider"),
        "@requests": path.resolve(process.cwd(), "src", "requests"),
        "@pro": path.resolve(process.cwd(), "src", "pro"),
      },
    },
    entry: {
      ...defaultConfig.entry,

      admin_home: path.resolve(process.cwd(), "src", "admin-home.js"),
      admin_course: path.resolve(process.cwd(), "src", "admin-course.js"),
      admin_lesson: path.resolve(process.cwd(), "src", "admin-lesson.js"),
      admin_quiz: path.resolve(process.cwd(), "src", "admin-quiz.js"),
      admin_order: path.resolve(process.cwd(), "src", "admin-order.js"),
      admin_setting: path.resolve(process.cwd(), "src", "admin-setting.js"),
      admin_tool: path.resolve(process.cwd(), "src", "admin-tool.js"),
      // admin_assignment: path.resolve(process.cwd(), "src", "admin-assignment.js"),

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
        chunks: "all",
        // maxInitialRequests: 10, // Prevents too many separate requests
        // minSize: 20 * 1024, // Minimum size to split (20KB)
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
    ],
  }
};
