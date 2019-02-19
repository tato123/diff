import _ from "lodash";
import React from "react";
import { compose, graphql } from "react-apollo";
import { toast, ToastContainer } from "react-toastify";
import { SAVE_VERSION } from "../../graphql/mutations";
import StringWorker from "./string.worker.js";
import Page from './styles/Page';
import SharedView from './styles/SharedView';
import Iframe from './styles/Iframe'
import Toolbar from "./toolbar";




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
    const version = params.get("version")
    const proto = version.indexOf('localhost') !== -1 ? 'http' : 'https';
    this.setState({
      versionId: version,
      version: `${proto}://${version}`

    });

    window.addEventListener("message", this.eventHandler);
    this.stringWorker = new StringWorker();

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
    const styles = m.data;
    this.setState({
      styles,
      changed: true,
      count: Object.keys(styles).length
    });
  };

  eventHandler = evt => {
    const data = evt.data;
    const stringworker = this.stringWorker;
    if (data.source === "getDiff-client" && data.type === "SITE_CHANGE") {
      const deltas = data.payload;
      stringworker.postMessage(deltas);
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

  onSave = evt => {
    const input = {
      host: this.state.versionId,
      deltas: JSON.stringify(this.state.styles)
    };
    const host = `https://${this.state.versionId}`;

    const copyText = document.querySelector("#clipboardText");
    copyText.value = host;
    copyText.select();
    const successful = document.execCommand("copy");

    this.props
      .saveSiteVersion({ variables: { input } })
      .then(() => {
        if (!successful) {
          throw new Error("Unable to copy content");
        }
      })
      .then(() => {
        toast.info("Prototype URL copied to clipboard", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false
        });
      })

      .catch(error => {
        console.error(" Unable to copy to clipboard", error);
        window.open(host);
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
          <Iframe id="frame" src={`${version}?edit=true`} title="prototype" />
        </SharedView>
        <Toolbar
          onEdit={this.onEdit}
          onSave={this.onSave}
          count={count}
          onClickChanges={() => this.setState({ isOpen: true })}
        />
        <input
          type="text"
          id="clipboardText"
          value={version}
          style={{ position: "absolute", opacity: 0 }}
        />
      </Page>
    );
  }
}

export default compose(graphql(SAVE_VERSION, { name: "saveSiteVersion" }))(
  Designer
);
