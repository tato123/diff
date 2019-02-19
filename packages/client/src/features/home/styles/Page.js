import React from 'react';
import styled from 'styled-components';

const Page = styled.div`
  display: grid;
  grid-template-areas: "." "." "." "." ".";
  grid-template-columns: 1fr;
  grid-auto-rows: auto;
  grid-template-rows: 64px 6fr 3fr 2fr 100px;
  margin: 32px 64px 0px 64px;
  font-size: 1rem;
  line-height: 1.6;
  grid-gap: 32px;
`;

export default Page;