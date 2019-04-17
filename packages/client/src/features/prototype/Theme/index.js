import React from "react";
import { Typography } from "antd";
import styled from "styled-components";

const { Title } = Typography;

const ColorCell = styled.div`
  width: 16px;
  height: 16px;
  margin: 8px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  display: inline-block;
`;

const FontCell = styled.div``;

const Formatter = ({ cellKey, cell }) => {
  return (
    <React.Fragment>
      {cellKey === "colors" && <ColorCell style={{ backgroundColor: cell }} />}
      {cellKey === "fontSize" && (
        <FontCell style={{ fontSize: cell, height: `calc(${cell} + 16px)` }}>
          Sample Font
        </FontCell>
      )}
    </React.Fragment>
  );
};

const formatTitle = key => {
  const titles = {
    colors: "Color",
    fontSize: "Typography"
  };
  return titles[key];
};

const sorted = (key, values) => {
  if (key === "colors") {
    return values;
  }
  if (key === "fontSize") {
    return values.sort((a, b) => {
      const re = /\d+/g;
      const valA = parseInt(a.match(re)[0]);
      const valB = parseInt(b.match(re)[0]);

      return valB - valA;
    });
  }
};

const Theme = ({ items }) => (
  <div>
    {Object.keys(items).map(key => (
      <React.Fragment>
        <Title level={4} style={{ marginTop: 16 }}>
          {formatTitle(key)}
        </Title>
        {sorted(key, items[key]).map(item => (
          <Formatter key={item} cellKey={key} cell={item} />
        ))}
      </React.Fragment>
    ))}
  </div>
);

export default Theme;
