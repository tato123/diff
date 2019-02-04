const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const babel = require("./babel.config");

const OUTPUT = path.resolve(__dirname, "../dist");
const ENV = process.env.NODE_ENV || "production";

const plugins = [];
if (ENV === "developement") {
  const XdpmPlugin = require("./webpack.plugin");
  plugins.push(new CopyWebpackPlugin(["src/manifest.json"]));
  plugins.push(new XdpmPlugin());
}

module.exports = {
  entry: {
    main: "./src/main.js"
  },
  mode: ENV,
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
  plugins
};
