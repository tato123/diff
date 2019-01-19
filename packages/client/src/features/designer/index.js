import React from "react";
import styled from "styled-components";
import Toolbar from "./toolbar";
import { compose, graphql } from "react-apollo";
import { SAVE_VERSION } from "../../graphql/mutations";
import ModalDialog, { ModalTransition } from "@atlaskit/modal-dialog";
import StringWorker from "./stringworker";
import _ from "lodash";
import ReactJson from "react-json-view";

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
    count: 0,
    isOpen: false,
    deltas: []
  };

  componentDidMount() {
    const params = new URLSearchParams(this.props.location.search);
    this.setState({ version: `https://${params.get("version")}` });

    window.addEventListener("message", this.eventHandler);
    this.stringWorker = new Worker(StringWorker);

    this.stringWorker.onmessage = _.debounce(this.handleWorkerMessage, 10);
  }

  componentWillUnmount() {
    window.removeEventListener("message", this.eventHandler);
  }

  handleWorkerMessage = m => {
    this.setState({
      styles: m.data
    });
  };

  eventHandler = evt => {
    const data = evt.data;
    if (data.source === "getDiff-client" && data.type === "SITE_CHANGE") {
      const deltas = data.payload;
      this.stringWorker.postMessage(deltas);

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
      state: { isEditing, version, count, isOpen, styles }
    } = this;

    return (
      <Page>
        <SharedView isEditing={isEditing}>
          <Iframe id="frame" src={version} title="prototype" />
        </SharedView>
        <Toolbar
          onEdit={this.onEdit}
          onSave={this.onSave}
          count={count}
          onClickChanges={() => this.setState({ isOpen: true })}
        />

        <ModalTransition>
          {isOpen && (
            <ModalDialog onClose={() => this.setState({ isOpen: false })}>
              <ReactJson src={styles} collapsed={1} />
            </ModalDialog>
          )}
        </ModalTransition>
      </Page>
    );
  }
}

export default compose(graphql(SAVE_VERSION, { name: "saveSiteVersion" }))(
  Designer
);
