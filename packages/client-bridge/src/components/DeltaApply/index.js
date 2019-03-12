import React from "react";
const toCss = require("to-css");

export default class DeltaApply extends React.Component {
  state = {
    css: ""
  };

  componentDidMount() {
    const delta = JSON.parse(
      '{"body .loader":{"style":"display:none"},"body > #preloder":{"style":"display:none"},".testimonials-slider .owl-animated-out":{"style":"width:557.5px;margin-right:128px;left:685px"},".col-lg-6 .owl-stage":{"style":"transition-duration:0s;transition-timing-function:ease;transition-delay:0s;transition-property:all;width:4799px;transform:translate3d(-2742px, 0px, 0px)"},".testimonials-slider .owl-item:nth-child(4)":{"style":"width:557.5px;margin-right:128px;left:686px"},".testimonials-slider .owl-item:nth-child(2)":{"style":"width:557.5px;margin-right:128px;left:686px"},".features-section h2":{"style":"font-size:10px;color:red"}}'
    );
    const styleMap = Object.keys(delta).reduce((acc, key) => {
      const keyVals = delta[key].style.split(";").reduce((acc, val) => {
        const [prop, cssVal] = val.split(":");
        return {
          ...acc,
          [prop]: cssVal
        };
      }, {});

      return {
        ...acc,
        [key]: keyVals
      };
    }, {});
    const cssMap = toCss(styleMap);

    document.head.insertAdjacentHTML(
      "beforeend",
      `
            <style>
            ${cssMap}
            </style>
        `
    );
  }

  render() {
    return null;
  }
}
