import React from 'react';
import styled from 'styled-components';

const Page = styled.div`
  display: grid;
  grid-template-areas:
    "sharedView"
    "footer";
  grid-template-rows: 1fr 64px;
  grid-template-columns: 1fr;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .toolbar {
    border-top: 3px solid #0052cc;
    grid-area: footer;
  }
`;

export default Page;