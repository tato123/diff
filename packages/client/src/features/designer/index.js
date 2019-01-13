import React from "react";
import styled from "styled-components";
import Button from '@atlaskit/button';
import { Link } from 'react-router-dom'


const Page = styled.div`
  display: grid;
  grid-template-areas:
    "."
    ".";
  grid-template-rows: 64px 1fr;
  grid-template-columns: 1fr;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .toolbar {
    border-bottom: 1px solid #dfe1e6;
    display: flex;
    flex: 1;
    align-items: center;
    padding: 16px;
  }

  iframe {
    width: 100%;
    height: 100%;
    outline: none;
    border: 5px solid gray;
    box-sizing: border-box;
  }
`;

export default class Designer extends React.Component {
  state = {
    version: null,
    changed: false,
    deltas: {}
  };

  componentDidMount() {
    console.log(this.props.location.search);
    const params = new URLSearchParams(this.props.location.search);
    this.setState({ version: `https://${params.get("version")}` });

    window.addEventListener('message', evt => {
      const data = evt.data;
      if (data.source === 'getDiff-client' && data.type === 'SITE_CHANGE') {
        console.log(data)
        this.setState({changed: true, deltas:data.payload})
      }
    });
  }

  getDiff=()=> {
    const frame = document.querySelector('#frame');
    frame.contentWindow.postMessage({
      type: 'getDiff'
    }, '*')
  }

  render() {
    return (
      <Page>
        <div className="toolbar">
        <Link to="/">Home</Link>
        <span style={{margin: "0 16px"}}>
      {this.state.changed && (<div>Site updated ({Object.keys(this.state.deltas).length} changes) </div>)}
      </span>
      <span style={{justifyContent: "flex-end", display: 'flex', flex: '1 auto'}}>
        <Button onClick={this.getDiff}>Publish changes</Button>
        </span>
        </div>
        <div>
          <iframe
            id="frame"
            src={this.state.version}
           
          />
        </div>
        
      </Page>
    );
  }
}
