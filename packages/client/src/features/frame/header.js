import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1 auto;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px 32px;
  border-right: 1px solid #ccc;

  label {
    display: block;
    font-size: 11px;
    margin-bottom: 6px
    text-transform: uppercase;
    font-weight: 500;
  }
  
  div {
    font-size: 22px;
    font-weight: 300;
  }

  input[type="text"] {
      border: none;
      outline: none;
      width: 100%;

  }
`;

export default () => (
  <Container>
    <Field>
      <label>Project:</label>
      <div>Redesign AtlanticBT</div>
    </Field>
    <Field style={{ border: "none", flex: "1 auto" }}>
      <label>Preivew At(URL):</label>
      <div>
        <input type="text" placeholder="http://www.domain.com" />
      </div>
    </Field>
  </Container>
);
