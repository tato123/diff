import React from 'react';
import styled from 'styled-components';

const Page = styled.div`
  display: grid;
  grid-template-areas: "." "." "." "." ".";
  grid-template-columns: 1fr;
  grid-auto-rows: auto;
  grid-template-rows: 64px 0.75fr 1fr 0.3fr 100px;
  margin: 75px;

  font-size: 1rem;
  line-height: 1.6;
  grid-gap: 32px;


  @media only screen and (min-width:1024px) {
    margin: 150px;
  }

  @media only screen and (max-width:500px) {
    margin: 25px;
  }

  margin-bottom: 16px;
`;

export default Page;