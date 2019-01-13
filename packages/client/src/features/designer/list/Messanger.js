import React from "react";

export default class FrameListener extends React.Component {
  messageHandler = evt => {
    console.log("[Parent] frame got", evt.data);
  };

  componentDidMount() {
    window.addEventListener("message", this.messageHandler);
  }

  componentWillUnmount() {
    window.removeEventListener("message", this.messageHandler);
  }

  sendMessage = msg => {
    const contentFrame = document.getElementById("contentFrame");
    if (contentFrame && contentFrame.contentWindow) {
      contentFrame.contentWindow.postMessage(msg, "*");
      // console.log("sending ", msg);
    }
  };

  render() {
    return this.props.children(this.sendMessage);
  }
}
