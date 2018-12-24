const presets = [
  [
    "@babel/env",
    {
      targets: {
        node: true
      },
      useBuiltIns: "usage"
    }
  ],
  "@babel/preset-react"
];

const plugins = [
  "@babel/plugin-transform-modules-commonjs",
  "@babel/plugin-proposal-class-properties"
];

module.exports = { presets, plugins };
