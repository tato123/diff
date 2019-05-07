import React, { useEffect, useRef, useState, useContext } from "react";
import { Layout, Avatar, Typography } from "antd";
import { useQuery } from "react-apollo-hooks";
import { PROJECT_BY_ID } from "../../graphql/query";
import styled from "styled-components";
import RxPostmessenger from "rx-postmessenger";
import _ from "lodash";
import UserContext from "../../utils/context";
import Editor from "./Editor";
import Tool from "./Tool";
import { useDocument } from "./useDocument";

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
    margin-right: -34px;
  }
`;

const DesignHeader = ({ data, activeUsers, userImage, url }) => (
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
        <Avatar src={userImage} />
      </div>
    </div>
  </Header>
);

const useConnectToFrame = (data, cb) => {
  const [messanger, setMessanger] = useState(null);
  const iframe = useRef(null);
  const initConnection = () => {
    const childMessenger = RxPostmessenger.connect(
      iframe.current.contentWindow,
      data.project.protocol + "://" + data.project.hostname
    );
    setMessanger(childMessenger);
  };

  const requestElement = () => {
    messanger.request("element:select").subscribe(cb);
  };

  useEffect(() => {
    if (!messanger) {
      return;
    }

    // wait until we receive a wake up of some sort
    // @todo add a wake up from the designer

    // enter designer mode
    messanger.request("designer").subscribe(console.log);

    setTimeout(() => {
      requestElement();
    }, 500);
  }, [messanger]);

  return { messanger, iframe, initConnection, requestElement };
};

const useProfile = () => {
  const user = useContext(UserContext);
  const profile = user.getProfile();
  return { user, profile };
};

const toIframeUrl = project => {
  return _.has(project, "protocol")
    ? project.protocol + "://" + project.hostname
    : "";
};

/**
 * Our designer view
 * @param {*} param0
 */
const Designer = ({ location, match }) => {
  const path = match.params;
  const { profile } = useProfile();

  const [element, setElement] = useState();

  const docId = path.id;
  const { doc, change } = useDocument(docId, profile.sub);

  const { data, loading, error } = useQuery(PROJECT_BY_ID, {
    variables: { id: docId }
  });

  const onElementSelected = elm => {
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

    if (!_.has(doc.changes.elements, data.selector)) {
      change(doc => {
        doc.changes.elements[data.selector] = data;
      });

      console.log(doc.changes.elements[data.selector]);

      setElement(data.selector);
    } else {
      setElement(data.selector);
    }
  };

  const {
    messanger,
    iframe,
    initConnection,
    requestElement
  } = useConnectToFrame(data, onElementSelected);

  if (error) {
    return null;
  }

  return (
    <Pagelayout style={{ height: "100vh", overflow: "hidden" }}>
      {loading && <div>Loading page</div>}
      {!loading && (
        <>
          <DesignHeader
            data={data}
            userImage={profile.picture}
            url={toIframeUrl(data.project)}
          />

          <Content style={{ position: "relative" }}>
            <Editor
              iframe={iframe}
              initConnection={initConnection}
              project={data && data.project}
            />
            {element != null && (
              <Tool
                state={doc.changes.elements[element]}
                onChange={newState => {
                  const { selector } = newState;
                  // perform change
                  change(doc => {
                    doc.changes.elements[selector] = newState;
                  });

                  messanger.notify("element:modify", newState);
                }}
                onClose={() => {
                  setElement(null);
                  requestElement();
                }}
              />
            )}
          </Content>
        </>
      )}
    </Pagelayout>
  );
};

export default Designer;
