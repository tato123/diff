import React, { useEffect, useRef, useState, useContext } from "react";
import { Layout, Avatar, Typography, Button, Select, Input } from "antd";
import { useQuery } from "react-apollo-hooks";
import styled from "styled-components";
import RxPostmessenger from "rx-postmessenger";
import { useDebounce } from "use-debounce";
import { Tabs } from "antd";
import _ from "lodash";
import { pointer } from "react-icons-kit/entypo/pointer";
import Icon from "react-icons-kit";
import { socialCss3 } from "react-icons-kit/ionicons/socialCss3";
import Tool from "../Tool";
const Iframe = styled.iframe`
  height: 100%;
  width: 100%;
  outline: none;
  border: none;
  box-shadow: rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  border-radius: 2px;
`;

const Editor = styled.div`
  height: 100%;

  small {
    font-size: 12px;
    font-weight: 500;
    display: block;
    padding: 6px 16px;
    top: -8px;
    position: relative;
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
  border-left: 1px solid #dadce0;
  background-color: #fff;

  button {
    display: flex;
    color: #1890ff;
    justify-content: center;
    margin-top: 1.2em;
  }

  button:first-child {
    margin-top: 0px;
  }
`;

interface PageEditorProps {
  iframe: string;
  initConnection: () => void;
  project: {
    hostname: string;
    protocol: string;
  };
}

const PageEditor: React.FC<PageEditorProps> = ({
  iframe,
  initConnection,
  project
}) => {
  const url = project.protocol + "://" + project.hostname;

  return (
    <Editor>
      <Iframe ref={iframe} onLoad={initConnection} src={url} />
      <Tool />
    </Editor>
  );
};

export default PageEditor;
