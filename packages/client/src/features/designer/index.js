import React from "react";
import styled from "styled-components";
import Toolbar from "./toolbar";
import Editor from "./editor";

const Page = styled.div`
  display: grid;
  grid-template-areas:
    "."
    ".";
  grid-template-rows: 1fr 64px;
  grid-template-columns: 1fr;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .toolbar {
    border-top: 1px solid #dfe1e6;
  }
`;

const SharedView = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  iframe {
    width: ${props => (props.isEditing ? "calc(100% - 400px)" : "calc(100%)")};

    height: 100%;
  }

  > div:last-child {
    width: 400px;
    height: 100%;
    position: absolute;
    top: 0px;
    right: 0px;
    transform: translateX(${props => (props.isEditing ? "0px" : "400px")});
  }
`;

const Iframe = styled.iframe`
  outline: none;
  box-sizing: border-box;
`;

export default class Designer extends React.Component {
  state = {
    version: null,
    changed: false,
    styles: null,
    isEditing: false
  };

  componentDidMount() {
    console.log(this.props.location.search);
    const params = new URLSearchParams(this.props.location.search);
    this.setState({ version: `https://${params.get("version")}` });

    window.addEventListener("message", evt => {
      const data = evt.data;
      if (data.source === "getDiff-client" && data.type === "SITE_CHANGE") {
        this.setState({ changed: true, deltas: data.payload });
      } else if (
        data.source === "getDiff-client" &&
        data.type === "SELECTED_ELEMENT"
      ) {
        console.log("got a new styles", data);
        this.setState({ styles: data.payload.styles });
      } else {
        console.log("data", data);
      }
    });
  }

  getDiff = () => {
    const frame = document.querySelector("#frame");
    frame.contentWindow.postMessage(
      {
        type: "getDiff"
      },
      "*"
    );
  };

  onEdit = () => {
    this.setState(state => ({ isEditing: !state.isEditing }));
  };

  render() {
    const {
      state: { isEditing, version, styles }
    } = this;
    console.log("styles", styles);
    return (
      <Page>
        <SharedView isEditing={isEditing}>
          <Iframe id="frame" src={version} title="prototype" />
        </SharedView>
        <Toolbar onEdit={this.onEdit} />
      </Page>
    );
  }
}
