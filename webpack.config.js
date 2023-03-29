const path = require("path");
const WebpackObfuscator = require('webpack-obfuscator');

module.exports = {
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.bundle.js",
  },
  plugins: [
    new WebpackObfuscator(
      {
        rotateStringArray: true,
      },
      ["index.bundle.js"]
    ),
  ],
  mode: "production",
};
