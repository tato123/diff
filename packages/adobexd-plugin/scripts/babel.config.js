const presets = [
    [
      "@babel/env",
      {
        targets: {
          node: true          
        },
        useBuiltIns: "usage",
      },
    ],
    "@babel/preset-react"
  ];

  const plugins = ["@babel/plugin-transform-modules-commonjs"];

  
  module.exports = { presets, plugins };