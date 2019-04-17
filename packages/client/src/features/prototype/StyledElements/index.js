import React from "react";
import { Collapse } from "antd";

const Panel = Collapse.Panel;

const ComponentsView = ({ items }) => {
  if (items == null) {
    return null;
  }
  return (
    <Collapse bordered={false}>
      {Object.keys(items).map(key => (
        <Panel header={key} key={key}>
          <div className="preview-field">
            <label>Color</label>
            <span
              className="preview"
              style={{ backgroundColor: items[key].color }}
            />
          </div>
          <div className="preview-field ">
            <label>Font</label>
            <span className="font">{items[key].fontSize}</span>
          </div>

          <div className="preview-field ">
            <label>Weight</label>
            <span className="font">{items[key].fontWeight}</span>
          </div>

          <div className="preview-field ">
            <label>Padding</label>
            <span className="font">{items[key].padding}</span>
          </div>

          <div className="preview-field ">
            <label>Margin</label>
            <span className="font">{items[key].margin}</span>
          </div>
        </Panel>
      ))}
    </Collapse>
  );
};

export default ComponentsView;
