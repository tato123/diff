const presets = [
  [
    "@babel/preset-env",
    {
      targets: "> 0.25%, not dead",
      useBuiltIns: "usage"
    }
  ],
  "@babel/preset-typescript",
  "@babel/preset-react"
];

const plugins = ["@babel/plugin-proposal-class-properties", "@babel/plugin-syntax-dynamic-import", ["import", {
  "libraryName": "antd",
  "style": 'css',   // or 'css'
}]];

module.exports = { presets, plugins };
