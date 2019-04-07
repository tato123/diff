const path = require("path");
const babel = require("./babel.config");
const Dotenv = require("dotenv-webpack");
const OUTPUT = path.resolve(__dirname, "./dist");

const ENV = process.env.NODE_ENV || "production";

module.exports = {
  devtool: ENV !== "production" ? "cheap-eval-source-map" : "none",
  mode: ENV !== "production" ? "development" : "production",
  entry: {
    diff: "./src/main.ts"
  },

  output: {
    path: OUTPUT,
    filename: "[name].js",
    libraryTarget: "umd",
    publicPath: "/assets/"
  },
  resolve: {
    mainFields: ["main", "module"],
    extensions: [".js", ".json", ".jsx", ".ts", ".tsx"],
    modules: ["node_modules"]
  },
  module: {
    rules: [
      {
        test: /\.(tsx?)|(jsx?)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          ...babel
        }
      },
      {
        test: /\.html$/,
        use: ["html-loader"]
      },
      {
        test: /\.css$/,
        use: [
          { loader: "react-web-component-style-loader" },
          { loader: "css-loader" }
        ]
      }
    ]
  },
  plugins: [
    new Dotenv({
      path: path.resolve(__dirname, "./.env." + ENV)
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, "example"),
    compress: true,
    port: 9000,
    disableHostCheck: true,
    publicPath: '/assets/'
  }
};
