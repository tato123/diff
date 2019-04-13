import React, { useEffect, useRef, useState } from "react";
import { Layout, Radio, Typography } from "antd";
import { useQuery } from "react-apollo-hooks";
import { ORIGIN_BY_ID } from "../../graphql/query";
import styled from "styled-components";
import RxPostmessenger from "rx-postmessenger";
import MonacoEditor from "react-monaco-editor";
import { useDebounce } from "use-debounce";

const { Content, Header } = Layout;

const { Title } = Typography;

const Iframe = styled.iframe`
  height: 100%;
  width: 100%;
  outline: none;
  border: none;
`;

const Pagelayout = styled(Layout)`
  .header {
    border-bottom: 1px solid #ebedf0;
    background: #fff;
    height: 42px;
    line-height: 42px;
  }

  .documentName {
    display: inline-block;
    margin-left: -36px;
  }

  .right {
    float: right;
    display: inline-block;
    margin-right: -30px;
  }
`;

const Editor = styled.div`
  @import url("https://rsms.me/inter/inter.css");

  display: flex;
  flex-direction: row;
  flex: 1 auto;
  height: 100%;

  > div:first-child {
    width: 70%;
  }

  > div:last-child {
    width: 30%;
  }

  .tools {
    font-family: "Inter", sans-serif;

    border-left: 1px solid #ebedf0;
    background-color: #fff;
    padding: 16px;
    overflow: none;

    .section-title {
      font-weight: 600;
      font-size: 11px;
      display: block;
      color: rgba(0, 0, 0, 0.8);
      line-height: 16px;
      height: 32px;
      text-transform: uppercase;
    }

    .editor {
      border: 1px solid rgba(0, 0, 0, 0.4);
      width: 100%;
      height: 50%;
      padding: 4px;
      border-radius: 4px;
    }
  }

  @supports (font-variation-settings: normal) {
    .tools {
      font-family: "Inter var", sans-serif;
    }
  }
`;

const Designer = ({ location }) => {
  const params = new URLSearchParams(location.search);
  const iframe = useRef(null);
  const [textbox, setTextbox] = useState("");
  const [messanger, setMessanger] = useState(null);
  const docId = params.get("docId");
  const { data, loading } = useQuery(ORIGIN_BY_ID, {
    variables: { host: docId }
  });

  const [debouncedText] = useDebounce(textbox, 100);

  const initConnection = () => {
    const childMessenger = RxPostmessenger.connect(
      iframe.current.contentWindow,
      data.origin.protocol + "://" + data.origin.origin
    );
    setMessanger(childMessenger);
  };

  const options = {
    minimap: {
      enabled: false
    }
  };

  useEffect(() => {
    if (!messanger) {
      return;
    }
    messanger.request("stylesheet", textbox).subscribe(console.log);
  }, [debouncedText]);

  return (
    <Pagelayout style={{ height: "100vh", overflow: "hidden" }}>
      {loading && <div>Loading page</div>}
      {!loading && (
        <React.Fragment>
          <Header className="header">
            <div className="documentName">
              <Title level={4}>{data.origin.name}</Title>
            </div>
            <div className="right">
              <Radio.Group defaultValue="a" buttonStyle="solid">
                <Radio.Button value="a">Edit</Radio.Button>
                <Radio.Button value="b">Preview</Radio.Button>
              </Radio.Group>
            </div>
          </Header>
          <Content style={{ position: "relative" }}>
            <Editor>
              <div style={{ padding: 8 }}>
                <Iframe
                  ref={iframe}
                  onLoad={initConnection}
                  src={data.origin.protocol + "://" + data.origin.origin}
                />
              </div>

              <div className="tools">
                <span className="section-title">StyleSheets</span>
                <div className="editor">
                  <MonacoEditor
                    width="100%"
                    height="90%"
                    language="css"
                    theme="vs-light"
                    options={options}
                    value={textbox}
                    editorDidMount={editor => editor.focus()}
                    onChange={newValue => setTextbox(newValue)}
                  />
                </div>
              </div>
            </Editor>
          </Content>
        </React.Fragment>
      )}
    </Pagelayout>
  );
};

export default Designer;
