import React from 'react';
import styled from 'styled-components';

const InputField = styled.div`
  width: 100%;
  display: grid;
  grid-template-areas: ". .";
  grid-template-columns: 70% 30%;
  column-gap: 24px;
`;

export default InputField;