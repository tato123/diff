import React from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
  padding: 0px;
  background: #eee;

  iframe {
    width: 100%;
    height: 100%;
    outline: none;
    border: none;
  }
`;

const Frame = () => (
  <Container>
    <iframe
      title="Content Frame"
      id="contentFrame"
      src="https://p-f9jpegyzu-dot-tester-dot-experiments-224320.appspot.com/"
    />
  </Container>
);

export default Frame;
