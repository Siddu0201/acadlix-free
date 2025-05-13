const defaultConfig = require("./node_modules/@wordpress/scripts/config/webpack.config");

const path = require("path");
const fs = require("fs");
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

// class GenerateManifestPlugin {
//   apply(compiler) {
//     compiler.hooks.emit.tapAsync("GenerateManifestPlugin", (compilation, callback) => {
//       let manifest = {};

//       compilation.chunks.forEach((chunk) => {
//         const files = Array.from(chunk.files).filter((file) => file.endsWith(".js"));

//         files.forEach((file) => {
//           const imports = Array.from(chunk.groupsIterable)
//             .flatMap(group => Array.from(group.chunks))
//             .filter(depChunk => depChunk !== chunk) // Exclude self
//             .map(depChunk => Array.from(depChunk.files)[0]) // Get first file of each chunk
//             .filter(Boolean);

//           // ✅ Fix: Use new `compilation.chunkGraph.getChunkModules()`
//           const cssFiles = Array.from(compilation.chunkGraph.getChunkModules(chunk))
//             .filter(module => module.type === "css/mini-extract")
//             .map(module => module.identifier().split("!").pop().split("?")[0]);

//           manifest[`'${file}'`] = {
//             "'file'": `${file}`,
//             "'name'": `${chunk.name}`,
//             "'imports'": [...new Set(imports)].map(i => `'${i}'`), // Ensure single quotes
//             "'css'": [...new Set(cssFiles)].map(c => `'${c}'`),
//           };
//         });
//       });

//       // Convert JSON to PHP array format
//       const phpManifest = `<?php\nreturn ` + jsonToPhpArray(manifest) + `;`;

//       // Write manifest.php to the build directory
//       fs.writeFileSync(path.resolve(compiler.options.output.path, "manifest.php"), phpManifest);

//       callback();
//     });
//   }
// }

// // Function to convert JSON to PHP array syntax
// function jsonToPhpArray(obj, indent = 1) {
//   let output = "array(\n";
//   const indentSpace = "  ".repeat(indent);

//   for (const [key, value] of Object.entries(obj)) {
//     let phpKey = key.startsWith("'") ? key : `'${key}'`;
//     let phpValue = formatPhpValue(value, indent + 1);
//     output += `${indentSpace}${phpKey} => ${phpValue},\n`;
//   }

//   output += "  ".repeat(indent - 1) + ")";
//   return output;
// }

// function formatPhpValue(value, indent) {
//   if (Array.isArray(value)) {
//     return "array(" + value.join(", ") + ")";
//   } else if (typeof value === "object") {
//     return jsonToPhpArray(value, indent);
//   } else if (typeof value === "string") {
//     return `'${value.replace(/'/g, "\\'")}'`;
//   } else {
//     return value;
//   }
// }

module.exports = {
  ...defaultConfig,

  entry: {
    ...defaultConfig.entry,

    admin_home: path.resolve(process.cwd(), "src", "admin-home.js"),
    admin_course: path.resolve(process.cwd(), "src", "admin-course.js"),
    admin_lesson: path.resolve(process.cwd(), "src", "admin-lesson.js"),
    admin_quiz: path.resolve(process.cwd(), "src", "admin-quiz.js"),
    admin_assignment: path.resolve(process.cwd(), "src", "admin-assignment.js"),
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
      chunks: "all",
      // maxInitialRequests: 10, // Prevents too many separate requests
      // minSize: 20 * 1024, // Minimum size to split (20KB)
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/, // Extract dependencies from node_modules
          name: "vendors",
          chunks: "all",
          priority: -10,

          // test: /[\\/]node_modules[\\/]/,
          // name(module) {
          //   // Create chunk names based on the module name
          //   const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
          //   return `vendor-${packageName.replace("@", "")}`;
          // },
          // chunks: "all",
          // enforce: true,
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
    // new GenerateManifestPlugin(), // Auto-generate manifest.php
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'static', // Generate a report.html file
    //   openAnalyzer: false,
    // }),
  ],
};
