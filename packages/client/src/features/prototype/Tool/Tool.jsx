import React, { useState, useReducer } from "react";
import styled from "styled-components";
import { Col, Button, InputNumber, Checkbox, Input, Select } from "antd";
import { SketchPicker } from "react-color";
import Draggable from "react-draggable";
import _ from "lodash";

import font from "./fonts";

const Option = Select.Option;

const Container = styled.div`
  width: 400px;
  height: 500px;
  background: #fff;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 0.5em 3em;
  border: none;
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

  cursor: pointer;
`;

InputNumber.Custom = styled(Input)`
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
  grid-template-columns: 70px 70px 1fr;
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

const ColorPicker = ({ value, valueKey, dispatch }) => {
  const [isColorPickerVisible, setColorPickerVisible] = useState(false);

  const onColorChange = color => {
    console.log("color change", color);

    dispatch({
      type: "mod",
      payload: { key: valueKey, value: color.hex }
    });
  };

  return (
    <>
      <ColorPreview
        color={value}
        onClick={() => setColorPickerVisible(s => !s)}
      />
      <Input.Custom
        style={{ width: 100 }}
        value={value}
        onChange={e =>
          dispatch({
            type: "mod",
            payload: { key: valueKey, value: e.currentTarget.value }
          })
        }
      />
      {isColorPickerVisible && (
        <div style={{ position: "absolute", zIndex: 3 }}>
          <SketchPicker color={value} onChange={onColorChange} />
        </div>
      )}
    </>
  );
};

const createReducer = sendElementChange =>
  function reducer(state, action) {
    switch (action.type) {
      case "mod":
        const newValue = _.cloneDeep(
          _.set(state, action.payload.key, action.payload.value)
        );
        sendElementChange(newValue);
        return newValue;
      case "asyncInit":
        return action.payload.value;
      default:
        return state;
    }
  };

const Tool = ({ state: initialState, onClose, sendElementChange }) => {
  const [state, dispatch] = useReducer(
    createReducer(sendElementChange),
    initialState
  );

  const mod = (key, value) =>
    dispatch({ type: "mod", payload: { key, value } });

  if (!state) {
    return null;
  }

  return (
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
              onClick={onClose}
              style={{ border: "none", fontSize: 20 }}
            />
          </Col>
        </Row>
        <HR />

        <Row mt col2>
          <div>
            <span>W</span>
            <InputNumber.Custom
              min={1}
              max={100000}
              defaultValue={0}
              value={state.style.width}
              onChange={e => mod("style.width", e.currentTarget.value)}
            />
            <Checkbox>auto</Checkbox>
          </div>
          <div>
            <span>H</span>
            <InputNumber.Custom
              min={1}
              max={100000}
              defaultValue={0}
              value={state.style.height}
              onChange={e => mod("style.height", e.currentTarget.value)}
            />
            <Checkbox>auto</Checkbox>
          </div>
        </Row>
        <Row mt col2>
          <Field title="Background Color">
            <ColorPicker
              valueKey="style.backgroundColor"
              dispatch={dispatch}
              value={state.style.backgroundColor}
            />
          </Field>
          <Field title="Text Color">
            <ColorPicker
              value={state.style.color}
              dispatch={dispatch}
              valueKey="style.color"
            />
          </Field>
        </Row>
        <Row mt>
          <Field title="Font">
            <FontGrid>
              <InputNumber.Custom
                min={1}
                max={120}
                value={state.style.fontSize}
                className="fw font-size"
                onChange={e => mod("style.fontSize", e.currentTarget.value)}
              />
              <Select
                defaultValue={state.style.fontWeight}
                onChange={value => mod("style.fontWeight", value)}
              >
                <Option value={100}>100</Option>
                <Option value={300}>300</Option>
                <Option value={500}>500</Option>
                <Option value={700}>700</Option>
              </Select>
              <Select
                defaultValue={state.style.fontFamily}
                className="fw"
                onChange={value => mod("style.fontFamily", value)}
              >
                {font.families.map(family => (
                  <Option value={family} key={family}>
                    {family}
                  </Option>
                ))}
              </Select>
            </FontGrid>
          </Field>
        </Row>
        <Row mt>
          <Field title="Border Radius">
            <Input.Custom
              value={state.style.borderRadius}
              onChange={e => mod("style.borderRadius", e.currentTarget.value)}
            />
          </Field>
        </Row>
        <Row mt>
          <Field title="Text">
            <div style={{ overflow: "auto" }}>
              <Input.Custom
                value={state.html.innerText}
                onChange={e => mod("html.innerText", e.currentTarget.value)}
              />
            </div>
          </Field>
        </Row>
      </Container>
    </Draggable>
  );
};

Tool.defaultProps = {
  state: null
};

export default Tool;
