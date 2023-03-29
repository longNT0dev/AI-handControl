const path = require("path");
const WebpackObfuscator = require("webpack-obfuscator");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.bundle.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "index.html"),
      filename: "index.html",
      chunks: ["index"],
      cache: false,
    }),
    new WebpackObfuscator(
      {
        rotateStringArray: true,
      },
      ["index.bundle.js"]
    ),
  ],
  mode: "production",
};
