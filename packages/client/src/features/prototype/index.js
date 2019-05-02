import React, { useEffect, useRef, useState, useContext } from "react";
import { Layout, Avatar, Typography, Button, Select, Input } from "antd";
import { useQuery } from "react-apollo-hooks";
import { PROJECT_BY_ID } from "../../graphql/query";
import styled from "styled-components";
import RxPostmessenger from "rx-postmessenger";
import { useDebounce } from "use-debounce";
import _ from "lodash";
import { useDocument, useActiveUsers } from "./useDocument";
import UserContext from "../../utils/context";
import Editor from "./Editor";

const { Content, Header } = Layout;

const { Title } = Typography;

const Pagelayout = styled(Layout)`
  .header {
    border-bottom: 1px solid #dadce0;
    background: #fff;
    height: 64px;
    line-height: 64px;
  }

  .documentName {
    display: inline-block;
    margin-left: -36px;
  }

  .right {
    float: right;
    display: inline-block;
    margin-right: -34px;
  }
`;

const ColorBox = styled.div`
  background-color: ${props => props.color};
  width: 24px;
  height: 24px;

  max-width: 24px;
  max-height: 24px;
  border-radius: 4px;
  margin-right: 1em;

  display: inline-flex;
  flex: 1 auto;
  justify-content: center;
  align-items: center;
  border: 1px solid #dadce0;
`;

const FieldTitle = styled(Title)`
  font-size: 14px !important;
  text-transform: uppercase;
  margin-bottom: 16px !important;
`;

const FieldInput = styled.div`
  border: 1px solid transparent;
  box-sizing: border-box;

  &:hover {
    border: 1px solid #dadce0;
  }
`;

const Designer = ({ location, match }) => {
  const params = new URLSearchParams(location.search);
  const path = match.params;
  const iframe = useRef(null);
  const [textbox] = useState("");

  const [messanger, setMessanger] = useState(null);
  const user = useContext(UserContext);
  const [userImage, setUserImage] = useState();
  const [element, setElement] = useState();
  const [tool, setTool] = useState("select");

  const docId = path.id;

  const { doc: editorDoc, change } = useDocument(docId);
  const activeUsers = useActiveUsers();
  const { data, loading, error } = useQuery(PROJECT_BY_ID, {
    variables: { id: docId }
  });

  const [components, setComponents] = useState(null);

  const [debouncedText] = useDebounce(textbox, 100);

  const initConnection = () => {
    const childMessenger = RxPostmessenger.connect(
      iframe.current.contentWindow,
      data.project.protocol + "://" + data.project.hostname
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

  const url = _.has(data, "project.protocol")
    ? data.project.protocol + "://" + data.project.hostname
    : "";

  return (
    <Pagelayout style={{ height: "100vh", overflow: "hidden" }}>
      {loading && <div>Loading page</div>}
      {!loading && (
        <>
          <Header className="header">
            <div className="documentName" style={{ paddingRight: 32 }}>
              <Title level={4} style={{ lineHeight: "64px" }}>
                {data.project.name}
              </Title>
              <small style={{ top: -55, position: "relative" }}>{url}</small>
            </div>

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
          </Header>

          <Content style={{ position: "relative" }}>
            <Editor
              iframe={iframe}
              initConnection={initConnection}
              project={data && data.project}
            />
          </Content>
        </>
      )}
    </Pagelayout>
  );
};

export default Designer;
