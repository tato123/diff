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
    elm: null
  };

  componentDidMount() {
    window.diff.parentMessanger
      .notifications("tool:change")
      .subscribe(({ tool }) => {
        console.log("Received a tool change", tool);
        this.setState({ tool });
      });

    window.diff.parentMessanger
      .notifications("element:search")
      .subscribe(val => {
        console.log("attempting to get", val);
        if (!val) {
          return;
        }
        const elements = document.querySelectorAll(val);
        elements.forEach(e => (e.style.border = "1px solid red"));
      });
  }

  onChange = val => {
    this.setState({ sel: val });
  };

  onSelect = element => {
    const computed = window.getComputedStyle(element);

    window.diff.parentMessanger.notify("element:selected", {
      tag: element.tagName,
      style: {
        ...computed
      }
    });
  };

  render() {
    const {
      state: { tool, elm }
    } = this;

    return (
      <SelectionContext.Provider value={elm}>
        <Box active={tool === "select"} onSelect={this.onSelect} />
        <h1 style={{ display: tool === "search" ? "block" : "none" }}>
          search
        </h1>
        <h1 style={{ display: tool === "annotate" ? "block" : "none" }}>
          annotate
        </h1>
      </SelectionContext.Provider>
    );
  }
}

ReactWebComponent.create(<App />, "my-component");
