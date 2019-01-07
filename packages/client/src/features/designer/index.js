import React from "react";
import styled from "styled-components";

const Page = styled.div`
  display: grid;
  grid-template-areas:
    "."
    ".";
  grid-template-rows: 1fr 64px;
  grid-template-columns: 1fr;
  width: 100%;
  height: 100%;

  .toolbar {
    border-top: 1px solid #dfe1e6;
  }

  iframe {
    width: 100%;
    height: 100%;
    outline: none;
    border: none;
  }
`;

export default class Designer extends React.Component {
  state = {
    version: null
  };

  componentDidMount() {
    console.log(this.props.location.search);
    const params = new URLSearchParams(this.props.location.search);
    this.setState({ version: `https://${params.get("version")}` });
  }

  render() {
    return (
      <Page>
        <div>
          <iframe
            src={this.state.version}
           
          />
        </div>
        <div className="toolbar">bottom</div>
      </Page>
    );
  }
}
