import React from "react";
import ReactWebComponent from "react-web-component";

import Toolbar from "./components/toolbar";
import Box from "./components/selection/box";

import SelectionContext from "./context/Selection";
import CSSInsepctor from "./components/inspectors/CSSInspector";
import "./index.css";

class App extends React.Component {
  state = {
    tool: "",
    elm: null,
    activeRequest: null,
    selected: null
  };

  componentDidMount() {
    window.diff.parentMessanger
      .requests("element:select")
      .subscribe(request => {
        this.setState({
          activeRequest: request,
          tool: "select",
          selected: null
        });
      });

    const cache = {};

    window.diff.parentMessanger
      .notifications("element:modify")
      .subscribe(val => {
        //
        const { selector, style, html } = val;
        const whitelistedCss = [
          "borderRadius",
          "backgroundColor",
          "color",
          "fontSize",
          "fontWeight",
          "fontFamily",
          "width",
          "height"
        ];
        const whitelistedHtml = ["innerText"];
        // get the document selector
        const selectedElements =
          cache[selector] || document.querySelectorAll(selector);
        cache[selector] = selectedElements;
        // apply for each element
        selectedElements.forEach(node => {
          // apply whitelisted changes, this is nasty because it re-renders multiple times per node, instead we should just
          // bulk edit the style attribute
          whitelistedCss.forEach(attr => {
            node.style[attr] = style[attr];
          });

          // apply whitelisted changes, this is nasty because it re-renders multiple times per node, instead we should just
          // bulk edit the style attribute
          whitelistedHtml.forEach(attr => {
            node[attr] = html[attr];
          });
        });
      });
  }

  onSelect = element => {
    const {
      state: { activeRequest }
    } = this;
    const computed = window.getComputedStyle(element);

    if (activeRequest) {
      const payload = {
        tag: element.tagName,
        style: {
          ...computed
        },
        html: {
          innerText: element.innerText,
          innerHTML: element.innerHTML
        }
      };
      activeRequest.respond(payload);
      this.setState({ activeRequest: null, selected: element, tool: "" });
    }
  };

  render() {
    const {
      state: { tool, elm }
    } = this;

    return (
      <SelectionContext.Provider value={elm}>
        <Box active={tool === "select"} onSelect={this.onSelect} />
      </SelectionContext.Provider>
    );
  }
}

ReactWebComponent.create(<App />, "my-component");
