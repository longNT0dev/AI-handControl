const path = require("path");
const WebpackObfuscator = require("webpack-obfuscator");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "index.html"),
      filename: "index.html",
      chunks: ["index"],
      cache: false,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "./manifest.json",
          to: path.join(__dirname, "dist"),
        },
      ],
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
