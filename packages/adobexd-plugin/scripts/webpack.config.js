const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const babel = require("./babel.config");
const XdpmPlugin = require("./webpack.plugin");

const OUTPUT = path.resolve(__dirname, "../dist");

module.exports = {
  entry: {
    main: "./src/main.js"
  },
  mode: process.env.NODE_ENV || "production",
  output: {
    path: OUTPUT,
    filename: "[name].js",
    libraryTarget: "commonjs2"
  },
  resolve: {
    mainFields: ["browser", "main", "module"],
    extensions: [".js", ".json", ".jsx"],
    modules: ["node_modules"]
  },
  devtool: "none", // prevent webpack from using eval() on my module
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          ...babel
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: "url-loader"
          }
        ]
      },
      {
        test: /\.svg$/,
        use: {
          loader: "text-loader",
          options: {}
        }
      }
    ]
  },
  externals: {
    scenegraph: "scenegraph",
    application: "application",
    uxp: "uxp"
  },
  plugins: [new CopyWebpackPlugin(["src/manifest.json"]), new XdpmPlugin()]
};
