import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 auto;
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding-left: 16px;
  padding-right: 16px;
`;

const HeaderRow = styled(Row)`
  border-bottom: 1px solid #ccc;
  text-transform: uppercase;
  font-size: 12px;
  padding: 8px 16px;
`;

const List = () => (
  <Container>
    <HeaderRow>Previewing changes for:</HeaderRow>
    <Row />
  </Container>
);

export default List;
