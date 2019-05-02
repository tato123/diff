import React from "react";
import styled from "styled-components";
import { Col, Button, InputNumber } from "antd";

const Container = styled.div`
  width: 400px;
  height: 500px;
  background: #fff;
  border: 3px solid #000;
  border-radius: 16px;
  position: absolute;
  z-index: 10001;
  bottom: 16px;
  right: 16px;
  padding: 16px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;

  ${props => props.mt && "margin-top: 16px"}

  ${props =>
    props.col2 &&
    `
      display: grid;
      grid-template-areas: ". .";
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr;
      grid-column-gap: 16px;

  `}

  .title {
    font-size: 24px;
    font-weight: bold;
    text-decoration: uppercase;
    display: block;
  }

  .sub-title {
    font-size: 1rem;
    display: block;
  }
`;

const ToolField = styled.div`
  label.title {
    text-transform: uppercase;
    font-size: 10px;
    display: block;
    margin-bottom: 8px;
  }
`;

const HR = styled.hr`
  border: none;
  border-bottom: 1px solid #dadce0;
  margin: 16px 0 0 0;
`;

const Field = ({ title, children }) => (
  <ToolField>
    <label className="title">{title}:</label>
    {children}
  </ToolField>
);

const Tool = ({ state }) => (
  <Container>
    <Row>
      <div>
        <span className="title">Diff</span>
        <span className="sub-title">.cta_button_hero</span>
      </div>
      <Col>X</Col>
    </Row>
    <HR />
    <Row mt>
      <Button>Move</Button>
      <Button>Rotate</Button>
    </Row>
    <Row mt>
      <div>
        <span>W</span>
        <InputNumber min={1} max={1000000000000000000000} defaultValue={3} />
      </div>
      <div>
        <span>H</span>
        <InputNumber min={1} max={1000000000000000000000} defaultValue={3} />
      </div>
    </Row>
    <Row mt col2>
      <Field title="Background Color">
        <label>123</label>
      </Field>
      <Field title="Text Color">
        <label>123</label>
      </Field>
    </Row>
    <Row mt>
      <Field title="Font">
        <label>123</label>
      </Field>
    </Row>
    <Row mt>
      <Field title="Border Radius">
        <label>123</label>
      </Field>
    </Row>
    <Row mt>
      <Field title="Text">
        <label>123</label>
      </Field>
    </Row>
  </Container>
);

Tool.defaultProps = {
  state: null
};

export default Tool;
