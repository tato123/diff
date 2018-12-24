import React from "react";
import styled from "styled-components";

const Img = styled.img`
  display: block;
  width: 100%;
  height: auto;
  object-fit: contain;
  box-sizing: content-box;
`;

export default () => (
  <Img
    src="https://storage.googleapis.com/diff-assets/diff-logo.png"
    alt="diff-logo"
  />
);
