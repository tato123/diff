import React from 'react';
import List from "../features/list";
import styled from "styled-components";
import Logo from "./Logo";
import Frame from "../features/frame";

import FrameHeader from "../features/frame/header";

import { ModalProvider } from "styled-react-modal";

const Container = styled.div`
  display: grid;
  grid-template-areas: ". .";
  grid-template-columns: 0.3fr 1fr;
  grid-template-rows: 1fr;
  width: 100vw;
  height: 100vh;
`;

const Detail = styled.div`
  border-right: 1px solid #ccc;
  display: grid;
  grid-template-areas:
    "header"
    "frame";
  grid-template-rows: 64px 1fr;
  grid-template-columns: 1fr;
`;

Detail.Header = styled.div`
  grid-area: header;
  border-bottom: 1px solid #ccc;
  display: flex;
  flex: 1 auto;
  width: 100%;

  img {
    height: 40px;
    width: auto;
    margin: 0;
    padding-left: 6px;

    align-self: center;
    display: flex;
  }
`;

Detail.Frame = styled.div`
  grid-area: frame;
`;

const Master = styled.div`
  display: grid;
  grid-template-areas:
    "header"
    "frame";
  grid-template-rows: 64px 1fr;
  grid-template-columns: 1fr;
`;

Master.Header = styled.div`
  grid-area: header;
  border-bottom: 1px solid #ccc;
`;

Master.Frame = styled.div`
  grid-area: frame;
`;
export default () => (
    <ModalProvider>
    <Container>
      <Detail>
        <Detail.Header>
          <Logo />
        </Detail.Header>
        <Detail.Frame>
          <List />
        </Detail.Frame>
      </Detail>
      <Master>
        <Master.Header>
          <FrameHeader />
        </Master.Header>
        <Master.Frame>
          <Frame />
        </Master.Frame>
      </Master>
    </Container>
  </ModalProvider>
)