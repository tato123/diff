const path = require("path");
const babel = require("./babel.config");

const OUTPUT = path.resolve(__dirname, "./dist");

module.exports = {
  devtool:
    process.env.NODE_ENV === "development" ? "cheap-eval-source-map" : "none",
  mode: process.env.NODE_ENV || "production",
  entry: {
    clientBridge: "./src/index.js"
  },

  output: {
    path: OUTPUT,
    filename: "[name].js",
    libraryTarget: "umd"
  },
  resolve: {
    mainFields: ["main", "module"],
    extensions: [".js", ".json", ".jsx"],
    modules: ["node_modules"]
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          ...babel
        }
      }
    ]
  }
};
