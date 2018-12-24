import reactShim from "./react-shim";
import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";

function main(selection) {
  let dialog;

  function getDialog() {
    if (dialog == null) {
      dialog = document.createElement("dialog");
      ReactDOM.render(<App dialog={dialog} selection={selection} />, dialog);
    }
    return dialog;
  }

  return document.body
    .appendChild(getDialog())
    .showModal()
    .then(result => {
      console.log("dialog closed");
    });
}

module.exports = {
  commands: {
    diffPlugin: main
  }
};
