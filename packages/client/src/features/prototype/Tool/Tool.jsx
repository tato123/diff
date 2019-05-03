import React from "react";
import styled from "styled-components";
import { Col, Button, InputNumber, Checkbox, Input, Select } from "antd";
import { SketchPicker } from "react-color";
import Draggable from "react-draggable";

const Option = Select.Option;

const Container = styled.div`
  width: 400px;
  height: 500px;
  background: #fff;
  border: 3px solid #000;
  border-radius: 16px;
  position: absolute;
  z-index: 2;
  bottom: 16px;
  right: 16px;
  padding: 16px;

  &:hover {
    .handle {
      opacity: 1;
    }
  }
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

const ColorPreview = styled.div`
  width: 22px;
  height: 16px;
  border: 1px solid #dadce0;
  display: inline-block;
`;

InputNumber.Custom = styled(InputNumber)`
  border-radius: 0px !important;
  border: none !important;
  border-bottom: 1px solid #dadce0 !important;
  margin-left: 8px !important;
`;

Input.Custom = styled(Input)`
  border-radius: 0px !important;
  border: none !important;
  border-bottom: 1px solid #dadce0 !important;
  margin-left: 8px !important;
`;

const DragHandle = styled.div`
  width: 100%;
  height: 16px;
  background: rgba(0, 0, 0, 0.1);
  opacity: 0.1;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  margin-top: -8px;
  margin-bottom: 8px;
  cursor: move;
  transition: all 250ms ease-in;
`;

const Field = ({ title, children }) => (
  <ToolField>
    <label className="title">{title}:</label>
    {children}
  </ToolField>
);

const ColorPicker = ({ color = "transparent" }) => (
  <>
    <ColorPreview color={color} />
    <Input.Custom style={{ width: 100 }} />
  </>
);

const Tool = ({ state }) => (
  <Draggable handle=".handle">
    <Container>
      <DragHandle className="handle" />
      <Row>
        <div style={{ flex: 1 }}>
          <span className="title">Diff</span>
          <span className="sub-title">.cta_button_hero</span>
        </div>
        <Col style={{ justifyContent: "flex-end" }}>
          <Button
            icon="close-circle"
            style={{ border: "none", fontSize: 20 }}
          />
        </Col>
      </Row>
      <HR />
      <Row mt>
        <Button>Move</Button>
        <Button>Rotate</Button>
      </Row>
      <Row mt col2>
        <div>
          <span>W</span>
          <InputNumber.Custom min={1} max={100000} defaultValue={3} />
          <Checkbox>auto</Checkbox>
        </div>
        <div>
          <span>H</span>
          <InputNumber.Custom min={1} max={100000} defaultValue={3} />
          <Checkbox>auto</Checkbox>
        </div>
      </Row>
      <Row mt col2>
        <Field title="Background Color">
          <ColorPicker />
        </Field>
        <Field title="Text Color">
          <ColorPicker />
        </Field>
      </Row>
      <Row mt>
        <Field title="Font">
          <InputNumber.Custom
            min={1}
            max={100000}
            style={{ width: 55, margin: 0 }}
          />
          <Select defaultValue="100">
            <Option value="100">100</Option>
            <Option value="300">300</Option>
            <Option value="500">500</Option>
          </Select>
          <Select defaultValue="lucy" style={{ width: 120 }}>
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="disabled" disabled>
              Disabled
            </Option>
            <Option value="Yiminghe">yiminghe</Option>
          </Select>
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
  </Draggable>
);

Tool.defaultProps = {
  state: null
};

export default Tool;
