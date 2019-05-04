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
  width: 100%;
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
  height: 22px;
  border: 1px solid #dadce0;
  display: inline-block;
  border-radius: 4px;
  position: relative;
  bottom: -4px;
  background: ${props => props.color || "transparent"};
`;

InputNumber.Custom = styled(InputNumber)`
  border-radius: 0px !important;
  border: none !important;
  border-bottom: 1px solid #dadce0 !important;
  margin: 0 8px !important;
  width: 75px !important;
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

const FontGrid = styled.div`
  display: grid;
  grid-template-areas: ". . .";
  grid-template-columns: 48px 70px 1fr;
  grid-template-rows: 1fr;
  grid-column-gap: 16px;
  width: 100%;

  .fw {
    width: 100% !important;
    margin: 0px !important;
  }
`;

const Field = ({ title, children }) => (
  <ToolField>
    <label className="title">{title}:</label>
    {children}
  </ToolField>
);

const ColorPicker = ({ color = "transparent", value }) => (
  <>
    <ColorPreview color={value} />
    <Input.Custom style={{ width: 100 }} value={value} />
  </>
);

const Tool = ({ state }) => (
  <Draggable handle=".handle">
    <Container>
      <DragHandle className="handle" />
      <Row>
        <div style={{ flex: 1 }}>
          <span className="title">Diff</span>
          <span className="sub-title">{state.selector}</span>
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
          <InputNumber.Custom
            min={1}
            max={100000}
            defaultValue={0}
            value={state.css.width}
          />
          <Checkbox>auto</Checkbox>
        </div>
        <div>
          <span>H</span>
          <InputNumber.Custom
            min={1}
            max={100000}
            defaultValue={0}
            value={state.css.height}
          />
          <Checkbox>auto</Checkbox>
        </div>
      </Row>
      <Row mt col2>
        <Field title="Background Color">
          <ColorPicker value={state.css.backgroundColor} />
        </Field>
        <Field title="Text Color">
          <ColorPicker value={state.css.color} />
        </Field>
      </Row>
      <Row mt>
        <Field title="Font">
          <FontGrid>
            <InputNumber.Custom
              min={1}
              max={120}
              value={state.css.fontSize}
              className="fw font-size"
            />
            <Select defaultValue={state.css.fontWeight}>
              <Option value={100}>100</Option>
              <Option value={300}>300</Option>
              <Option value={500}>500</Option>
            </Select>
            <Select defaultValue="lucy" className="fw">
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
              <Option value="disabled" disabled>
                Disabled
              </Option>
              <Option value="Yiminghe">yiminghe</Option>
            </Select>
          </FontGrid>
        </Field>
      </Row>
      <Row mt>
        <Field title="Border Radius">
          <label>{state.css.borderRadius}</label>
        </Field>
      </Row>
      <Row mt>
        <Field title="Text">
          <label>{state.html.innerText}</label>
        </Field>
      </Row>
    </Container>
  </Draggable>
);

const sampleState = {
  selector: ".cta_button_hero",
  css: {
    width: 300,
    height: 10,
    backgroundColor: "#ffffff",
    color: "#000",
    borderRadius: 0,
    fontFamily: "Arial",
    fontSize: "12px",
    fontWeight: 300
  },
  html: {
    innerText: "Hello world"
  }
};

Tool.defaultProps = {
  state: sampleState
};

export default Tool;
