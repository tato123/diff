import React from "react";
import styled from "styled-components";
import Toolbar from "./toolbar";
import { compose, graphql } from "react-apollo";
import { SAVE_VERSION } from "../../graphql/mutations";
import ModalDialog, { ModalTransition } from "@atlaskit/modal-dialog";
import StringWorker from "./stringworker";
import _ from "lodash";
import { ToastContainer, toast } from "react-toastify";
import EditCss from "./edit-css.gif";

const Page = styled.div`
  display: grid;
  grid-template-areas:
    "sharedView"
    "footer";
  grid-template-rows: 1fr 64px;
  grid-template-columns: 1fr;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .toolbar {
    border-top: 3px solid #0052cc;
    grid-area: footer;
  }
`;

const SharedView = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  grid-area: sharedView;

  iframe {
    width: ${props => (props.isEditing ? "calc(100% - 400px)" : "calc(100%)")};

    height: 100%;
  }

  .Toastify__toast {
    bottom: 32px;
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

const Walkthrough = styled.div`
  height: 650px;
  width: 100%;
`;

const Iframe = styled.iframe`
  outline: none;
  box-sizing: border-box;
  border: none;
`;

class Designer extends React.Component {
  state = {
    version: null,
    changed: false,
    styles: null,
    isEditing: false,
    count: 0,
    isOpen: false
  };

  componentDidMount() {
    const params = new URLSearchParams(this.props.location.search);
    this.setState({
      versionId: params.get("version"),
      version: `https://${params.get("version")}?diffEditMode=true`
    });

    window.addEventListener("message", this.eventHandler);
    this.stringWorker = new Worker(StringWorker);

    this.stringWorker.onmessage = _.debounce(this.handleWorkerMessage, 10);

    const walkthrough = localStorage.getItem("_walkthrough_01");
    if (!walkthrough) {
      this.setState({
        isOpen: true
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener("message", this.eventHandler);
  }

  handleWorkerMessage = m => {
    console.log("worker message", m.data);
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
      host: this.state.versionId,
      deltas: JSON.stringify(this.state.styles)
    };
    this.props
      .saveSiteVersion({ variables: { input } })
      .then(response => {
        navigator.clipboard.writeText(`https://${this.state.versionId}`).then(
          function() {
            toast.info("Prototype URL copied to clipboard", {
              position: "bottom-right",
              autoClose: 2000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: false
            });
          },
          function() {
            toast.error("Unable to save url to clipboard", {
              position: "bottom-right",
              autoClose: 2000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: false
            });
          }
        );
        console.log(response);
      })
      .catch(error => {
        console.error(error);
      });
  };

  render() {
    const {
      state: { isEditing, version, count, isOpen }
    } = this;

    return (
      <Page>
        <SharedView isEditing={isEditing}>
          <ToastContainer />
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
              <Walkthrough>
                <h1>Getting Started with Diff</h1>
                <p>
                  With diff you can modify sites using browser devtools, save
                  those changes, and share them as a unique url
                </p>

                <h2>Step 1</h2>
                <p>First open devtools and make your changes</p>
                <img
                  src={EditCss}
                  style={{ objectFit: "contain", width: "100%" }}
                  alt="Devtool instructions"
                />

                <h2>Step 2</h2>
                <p>
                  When you're satisified with your changes click save changes at
                  the bottom, this will save all your changes to a unique url
                  that you can share
                </p>
              </Walkthrough>
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
