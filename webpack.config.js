const defaultConfig = require("./node_modules/@wordpress/scripts/config/webpack.config");

const path = require("path");
const fs = require("fs");
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const webpack = require('webpack');
const { WebpackAssetsManifest } = require('webpack-assets-manifest');

module.exports = (env, argv) => {
  const isPremium = process.env.REACT_APP_IS_PREMIUM === 'true';
  const outputPath = isPremium ? 'Pro' : 'Common';
  const existingDefinePlugin = defaultConfig.plugins.find(
    (plugin) => plugin.constructor.name === 'DefinePlugin'
  );

  if (existingDefinePlugin) {
    Object.assign(existingDefinePlugin.definitions, {
      'process.env.REACT_APP_IS_PREMIUM': JSON.stringify(process.env.REACT_APP_IS_PREMIUM || 'false'),
      'process.env.REACT_APP_MODE': JSON.stringify(defaultConfig?.mode || 'development'),
    });
  } else {
    defaultConfig.plugins.push(new webpack.DefinePlugin({
      'process.env.REACT_APP_IS_PREMIUM': JSON.stringify(process.env.REACT_APP_IS_PREMIUM || 'false'),
      'process.env.REACT_APP_MODE': JSON.stringify(defaultConfig?.mode || 'development'),
    }));
  }
  return {
    ...defaultConfig,

    resolve: {
      ...defaultConfig.resolve,
      alias: {
        ...defaultConfig.resolve.alias,
        "@acadlix": path.resolve(process.cwd(), "src"),
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
      admin_addon: path.resolve(process.cwd(), "src", "admin-addon.js"),
      admin_student: path.resolve(process.cwd(), "src", "admin-student.js"),
      admin_design_studio: path.resolve(process.cwd(), "src", "admin-design-studio.js"),

      front: path.resolve(process.cwd(), "src", "front.js"),
      front_checkout: path.resolve(process.cwd(), "src", "front-checkout.js"),
      front_single_course: path.resolve(process.cwd(), "src", "front-single-course.js"),
      front_button_listener: path.resolve(process.cwd(), "src", "front-button-listener.js"),
    },

    output: {
      ...defaultConfig.output,
      // chunkFilename: '[name].bundle.js'
      filename: "[name].js",
      chunkFilename: "[name].bundle.js",
      path: path.resolve(process.cwd(), "build", outputPath),
    },

    optimization: {
      ...defaultConfig.optimization,
      runtimeChunk: "single",
      chunkIds: 'named',   // instead of 'deterministic' or 'natural'
      moduleIds: 'named',
      splitChunks: {
        chunks: "all",
        // maxInitialRequests: 10, // Prevents too many separate requests
        // minSize: 20 * 1024, // Minimum size to split (20KB)
        // cacheGroups: {
        //   vendors: {
        //     test: /[\\/]node_modules[\\/]/, // Extract dependencies from node_modules
        //     name: "vendors",
        //     chunks: "all",
        //     priority: -10,
        //   },
        //   default: false
        // },
      },
    },

    devServer: {
      ...defaultConfig.devServer,
      hot: true,
      watchFiles: ["src/**/*"],
      liveReload: false,
      allowedHosts: 'all',
      // proxy: [
      //   {
      //     context: ['/api'],
      //     target: 'http://localhost:3000',
      //   },
      // ],
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },
    plugins: [
      ...defaultConfig.plugins,
      new WebpackAssetsManifest({
        output: 'assets-manifest.json',
        publicPath: true,
        writeToDisk: true,
        entrypoints: true,
      }),
      {
        apply: (compiler) => {
          compiler.hooks.afterEmit.tap('ConvertManifestToPHP', (compilation) => {
            const manifestFile = path.resolve(compiler.options.output.path, 'assets-manifest.json');
            const phpFile = path.resolve(compiler.options.output.path, 'assets-manifest.php');

            if (fs.existsSync(manifestFile)) {
              const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));

              const phpContent = `<?php\nreturn ${phpArray(manifest)};\n`;
              fs.writeFileSync(phpFile, phpContent, 'utf8');
            }
          });
        },
      },
    ],
    externals: {
      ...defaultConfig.externals,
      // '@wordpress/i18n': 'wp.i18n',
    },
  }
};

function phpArray(obj) {
  if (typeof obj === 'object' && !Array.isArray(obj)) {
    return "array(\n" + Object.entries(obj).map(([k, v]) => `  '${k}' => ${phpArray(v)}`).join(",\n") + "\n)";
  } else if (Array.isArray(obj)) {
    return "array(" + obj.map(v => phpArray(v)).join(", ") + ")";
  } else {
    return `'${obj}'`;
  }
}