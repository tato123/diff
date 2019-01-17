import React from "react";
import styled from "styled-components";
import Toolbar from "./toolbar";
import { compose, graphql } from "react-apollo";
import { SAVE_VERSION } from "../../graphql/mutations";

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

class Designer extends React.Component {
  state = {
    version: null,
    changed: false,
    styles: null,
    isEditing: false,
    count: 0
  };

  componentDidMount() {
    const params = new URLSearchParams(this.props.location.search);
    this.setState({ version: `https://${params.get("version")}` });

    window.addEventListener("message", this.eventHandler);
  }

  componentWillUnmount() {
    window.removeEventListener(this.eventHandler);
  }

  eventHandler = evt => {
    const data = evt.data;
    if (data.source === "getDiff-client" && data.type === "SITE_CHANGE") {
      const deltas = data.payload;
      this.setState({
        changed: true,
        deltas,
        count: Object.keys(deltas).length
      });
    }
  };

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

  onSave = () => {
    const input = {
      versionUrl: this.state.version,
      deltas: JSON.stringify(this.state.deltas)
    };
    this.props
      .saveSiteVersion({ variables: { input } })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.error(error);
      });
  };

  render() {
    const {
      state: { isEditing, version, count }
    } = this;
    return (
      <Page>
        <SharedView isEditing={isEditing}>
          <Iframe id="frame" src={version} title="prototype" />
        </SharedView>
        <Toolbar onEdit={this.onEdit} onSave={this.onSave} count={count} />
      </Page>
    );
  }
}

export default compose(graphql(SAVE_VERSION, { name: "saveSiteVersion" }))(
  Designer
);
