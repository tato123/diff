// eslint-disable-next-line no-unused-vars
import React from "react";
import styled from "styled-components";

const SharedView = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  grid-area: sharedView;
  background: #fefefe;

  iframe,
  .innerView {
    width: 100% !important;
    height: 100% !important;
    position: absolute;
    top: 0px;
    left: 0px;
  }

  .innerView > .message {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1 auto;
    height: 100%;
  }

  .Toastify__toast {
    bottom: 32px;
  }

  /* > div:last-child {
  width: 400px;
  height: 100%;
  position: absolute;
  top: 0px;
  right: 0px;
  transform: translateX(${props => (props.isEditing ? "0px" : "400px")});
} */
`;

export default SharedView;
