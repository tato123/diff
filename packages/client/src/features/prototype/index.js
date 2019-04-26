import React, { useEffect, useRef, useState, useContext } from "react";
import { Layout, Avatar, Typography, Button, Select, Input } from "antd";
import { useQuery } from "react-apollo-hooks";
import { ORIGIN_BY_ID } from "../../graphql/query";
import styled from "styled-components";
import RxPostmessenger from "rx-postmessenger";
import { useDebounce } from "use-debounce";
import { Tabs } from "antd";
import _ from "lodash";
import { useDocument, useActiveUsers } from "./useDocument";
import UserContext from "../../utils/context";
import { pointer } from "react-icons-kit/entypo/pointer";
import Icon from "react-icons-kit";

const TabPane = Tabs.TabPane;

const { Content, Header } = Layout;

const { Title } = Typography;

const Iframe = styled.iframe`
  height: 100%;
  width: 100%;
  outline: none;
  border: none;
  box-shadow: rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  border-radius: 2px;
`;

const Pagelayout = styled(Layout)`
  .header {
    border-bottom: 1px solid #ccc;
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
  display: grid;
  grid-template-areas: ". . .";
  grid-template-columns: 1fr 300px 64px;
  grid-template-rows: 1fr;
  height: 100%;
  background-color: #f8f9fa

  > div:first-child {
    width: 100%;
  }

  > div:nth-child(2) {
    display: flex;
    flex: 1 auto;

    .empty {
      display: flex;
      flex: 1 auto;
      justify-content: center;
      align-items: center;
    }

    .profile {
      padding: 32px;

      .field-group {
        margin-top: 2em;
      }
    }
  }

  .tools {
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

const Tools = styled.div`
  z-index: 1001;
  right: 0px;
  top: 0px;
  display: flex;
  flex: 1 auto;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  border-left: 1px solid #ccc;
  background-color: #fff;

  button {
    display: flex;
    color: #1890ff;
    justify-content: center;
  }
`;

const ColorBox = styled.div`
  background-color: ${props => props.color};
  width: 44px;
  height: 44px;

  max-width: 44px;
  max-height: 44px;
  border-radius: 4px;
  margin-right: 1em;

  display: inline-flex;
  flex: 1 auto;
  justify-content: center;
  align-items: center;
  border: 1px solid #ccc;
`;

const FieldTitle = styled(Title)`
  font-size: 14px !important;
  text-transform: uppercase;
  margin-bottom: 16px !important;
`;

const SelectToolDetails = ({ value: element }) => (
  <div className="profile">
    <Title>{element.tag}</Title>
    <div className="field-group">
      <FieldTitle>Selector</FieldTitle>
      <div>...</div>
    </div>
    <div className="field-group">
      <FieldTitle>Typography</FieldTitle>
      <div>{element.style.fontFamily}</div>
    </div>
    <div className="field-group">
      <FieldTitle>Background</FieldTitle>
      <div style={{ display: "flex", alignItems: "center" }}>
        <ColorBox color={element.style.backgroundColor} />
        {element.style.backgroundColor}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: "0.5em"
        }}
      >
        <ColorBox color={element.style.color} />
        {element.style.color}
      </div>
    </div>
  </div>
);

const Designer = ({ location }) => {
  const params = new URLSearchParams(location.search);
  const iframe = useRef(null);
  const [textbox] = useState("");

  const [search, setSearch] = useState("");
  const [messanger, setMessanger] = useState(null);
  const user = useContext(UserContext);
  const [userImage, setUserImage] = useState();
  const [element, setElement] = useState();
  const [tool, setTool] = useState("select");

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
    messanger.request("selection").subscribe(console.log);

    messanger.notifications("element:selected").subscribe(elm => {
      console.log(elm);
      setElement(elm);
    });
  }, [messanger]);

  useEffect(() => {
    if (!messanger) {
      return;
    }
    messanger.request("stylesheet", textbox).subscribe(console.log);
  }, [debouncedText]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const profile = user.getProfile();
    setUserImage(profile.picture);
  }, [user]);

  useEffect(() => {
    if (!messanger || !tool) {
      return;
    }
    setTimeout(() => {
      messanger.notify("tool:change", { tool });
    }, 500);
  }, [tool, messanger]);

  return (
    <Pagelayout style={{ height: "100vh", overflow: "hidden" }}>
      {loading && <div>Loading page</div>}
      {!loading && (
        <>
          <Header className="header">
            <div className="documentName" style={{ paddingRight: 32 }}>
              <Title level={4}>{data.origin.name}</Title>
            </div>
            <Input.Search
              placeholder="Search Elements"
              style={{ width: "50%" }}
              value={search}
              onChange={e => {
                messanger.notify("element:search", e.currentTarget.value);
                setSearch(e.currentTarget.value);
              }}
            />
            <div className="right">
              {activeUsers && activeUsers.map(user => <Avatar />)}
              <div>
                <Avatar
                  style={{
                    backgroundColor: "orange",
                    border: "2px solid #fff",
                    verticalAlign: "middle",
                    marginRight: "-10px",
                    zIndex: 200
                  }}
                >
                  B
                </Avatar>
                <Avatar
                  style={{
                    backgroundColor: "green",
                    border: "2px solid #fff",
                    verticalAlign: "middle"
                  }}
                >
                  J
                </Avatar>
                <Avatar src={userImage} />
              </div>
            </div>
            <div style={{ height: 64, width: "100%" }}>
              <input style={{ width: "100%" }} />
            </div>
          </Header>

          <Content style={{ position: "relative" }}>
            <Editor>
              <div>
                <Iframe
                  ref={iframe}
                  onLoad={initConnection}
                  src={data.origin.protocol + "://" + data.origin.origin}
                />
              </div>
              <div>
                {!element && <div className="empty">Nothing selected</div>}
                {element && <SelectToolDetails value={element} />}
              </div>
              <Tools>
                <Button shape="circle" onClick={() => setTool(t => "select")}>
                  <Icon icon={pointer} size={20} />
                </Button>
              </Tools>
            </Editor>
          </Content>
        </>
      )}
    </Pagelayout>
  );
};

export default Designer;
