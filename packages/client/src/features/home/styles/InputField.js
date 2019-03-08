// eslint-disable-next-line no-unused-vars
import React from 'react';
import styled from 'styled-components';

const InputField = styled.div`
  width: 100%;
  display: grid;
  grid-template-areas: ". .";
  grid-template-columns: 70% 30%;
  grid-column-gap: 24px;
  grid-row-gap: 24px;

  input, button {
    box-sizing: border-box;
    height: 50px;
    max-height: 50px;
    padding: 8px 16px;
    width: 100%;
  }

  @media only screen and (max-width: 900px) {
    grid-template-columns: 1fr;
    grid-template-areas: "." ".";
  }

`;

export default InputField;