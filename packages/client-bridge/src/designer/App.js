import React from "react";
import ReactWebComponent from "react-web-component";

import Toolbar from "./components/toolbar";
import Box from "./components/selection/box";

import SelectionContext from "./context/Selection";
import CSSInsepctor from "./components/inspectors/CSSInspector";
import "./index.css";

class App extends React.Component {
  state = {
    sel: "",
    elm: null
  };

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
      state: { sel, elm }
    } = this;

    return (
      <SelectionContext.Provider value={elm}>
        <Box active onSelect={this.onSelect} />
      </SelectionContext.Provider>
    );
  }
}

ReactWebComponent.create(<App />, "my-component");
