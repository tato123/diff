// eslint-disable-next-line no-unused-vars
import React from 'features/prototype/styles/react';
import styled from 'features/prototype/styles/styled-components';

const SharedView = styled.div`
position: relative;
width: 100%;
height: 100%;
grid-area: sharedView;

iframe {
  width: ${props => (props.isEditing ? "calc(100% - 400px)" : "calc(100%)")};

  height: 100%;
}

.Toastify__toast {
  bottom: 32px;
}

> div:last-child {
  width: 400px;
  height: 100%;
  position: absolute;
  top: 0px;
  right: 0px;
  transform: translateX(${props => (props.isEditing ? "0px" : "400px")});
}
`;

export default SharedView;