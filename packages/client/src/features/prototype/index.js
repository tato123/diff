import React, { useEffect, useRef, useState, useContext } from "react";
import { Layout, Radio, Typography } from "antd";
import { useQuery } from "react-apollo-hooks";
import { ORIGIN_BY_ID } from "../../graphql/query";
import styled from "styled-components";
import RxPostmessenger from "rx-postmessenger";
import { useDebounce } from "use-debounce";
import { Tabs } from "antd";
import StyledElements from "./StyledElements";
import Theme from "./Theme";
import _ from "lodash";
import { useDocument, useActiveUsers } from "./useDocument";
import CustomComponent from "./CustomComponent";

const TabPane = Tabs.TabPane;

const { Content, Header } = Layout;

const { Title } = Typography;

const Avatar = styled.div`
  height: 16px;
  width: 16px;
  background-color: #ccc;
  border-radius: 50%;
  display: inline-block;
`;

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

    .view {
      overflow: auto;
      height: 100%;
    }
  }

  .preview {
    display: block;
    height: 16px;
    width: 16px;
    border: rgba(0, 0, 0, 0.08);
  }

  .preview-field {
    display: grid;
    grid-template-areas: ". .";
    grid-template-columns: 20% 9fr;
    grid-column-gap: 16px;
    justify-content: center;
    align-items: center;
    margin-top: 12px;

    .font {
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
  }

  .preview-field.vertical {
    grid-template-areas: "." ".";
    grid-template-columns: 1fr;
    grid-row-gap: 4px;
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
  const [textbox] = useState("");
  const [messanger, setMessanger] = useState(null);
  const [theme, setTheme] = useState({});

  const docId = params.get("docId");

  const { doc: editorDoc, change } = useDocument(docId);
  const activeUsers = useActiveUsers();
  const { data, loading, error } = useQuery(ORIGIN_BY_ID, {
    variables: { host: docId }
  });

  const [components, setComponents] = useState(null);

  const [debouncedText] = useDebounce(textbox, 100);

  const initConnection = () => {
    const childMessenger = RxPostmessenger.connect(
      iframe.current.contentWindow,
      data.origin.protocol + "://" + data.origin.origin
    );
    setMessanger(childMessenger);
  };

  if (error) {
    return null;
  }

  useEffect(() => {
    if (!messanger) {
      return;
    }
    messanger.request("getPageTheme").subscribe(val => setComponents(val));
  }, [messanger]);

  useEffect(() => {
    if (components) {
      const newTheme = _.chain(_.values(components))
        .reduce((acc, val) => {
          return {
            colors: _.uniq([..._.get(acc, "colors", []), val.color]),
            fontSize: _.uniq([..._.get(acc, "fontSize", []), val.fontSize])
          };
        }, {})
        .value();
      setTheme(newTheme);
    }
  }, [components]);

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
              {activeUsers && activeUsers.map(user => <Avatar />)}
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
                <Tabs defaultActiveKey="1">
                  <TabPane tab="Components" key="1">
                    <div className="view">
                      <CustomComponent
                        value={_.get(editorDoc, "style", "")}
                        onChange={val => change(doc => (doc.style = val))}
                      />
                    </div>
                  </TabPane>
                  <TabPane tab="Theme" key="2">
                    <Theme items={theme} />
                  </TabPane>
                  <TabPane tab="Comments" key="3">
                    comment
                  </TabPane>
                </Tabs>
              </div>
            </Editor>
          </Content>
        </React.Fragment>
      )}
    </Pagelayout>
  );
};

export default Designer;
