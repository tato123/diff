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
import Tool from "./Tool";

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
  const path = match.params;
  const iframe = useRef(null);

  const [messanger, setMessanger] = useState(null);
  const user = useContext(UserContext);
  const [userImage, setUserImage] = useState();
  const [element, setElement] = useState();

  const docId = path.id;

  const { doc: editorDoc, change } = useDocument(docId);
  const activeUsers = useActiveUsers();
  const { data, loading, error } = useQuery(PROJECT_BY_ID, {
    variables: { id: docId }
  });

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

    // wait until we receive a wake up of some sort
    // @todo add a wake up from the designer

    // enter designer mode
    messanger.request("designer").subscribe(console.log);

    // // get a selection
    setTimeout(() => {
      requestElement();
    }, 500);
  }, [messanger]);

  const sendMessage = payload => messanger.notify("element:modify", payload);

  const requestElement = () => {
    messanger.request("element:select").subscribe(elm => {
      console.log(elm);

      const data = {
        selector: elm.tag,
        style: {
          ...elm.style
        },
        html: {
          innerText: elm.html.innerText,
          innerHTML: elm.html.innerHTML
        }
      };
      setElement(data);
    });
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    const profile = user.getProfile();
    setUserImage(profile.picture);
  }, [user]);

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
            {element != null && (
              <Tool
                state={element}
                onClose={() => {
                  setElement(null);
                  requestElement();
                }}
                sendElementChange={sendMessage}
              />
            )}
          </Content>
        </>
      )}
    </Pagelayout>
  );
};

export default Designer;
