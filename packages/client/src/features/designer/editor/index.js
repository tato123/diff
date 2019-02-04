import React from "react";
import styled from "styled-components";
import EmptyState from "@atlaskit/empty-state";

const View = styled.div`
  display: flex;
  padding: 16px;
  box-sizing: border-box;
  overflow: auto;
`;

const props = {
  header: "I am the header",
  description: `Lorem ipsum is a pseudo-Latin text used in web design, 
        typography, layout, and printing in place of English to emphasise 
        design elements over content. It's also called placeholder (or filler) 
        text. It's a convenient tool for mock-ups.`
};

const CellPreview = (key, value) => {
  if (key.indexOf("color") !== -1) {
    return (
      <React.Fragment>
        <div
          style={{
            width: "12px",
            height: "12px",
            backgroundColor: value,
            display: "flex",
            alignSelf: "center",
            marginRight: "4px",
            border: "1px solid #eee"
          }}
        />
        <div>{value}</div>
      </React.Fragment>
    );
  }

  return <span>{value}</span>;
};

const MapStyle = style => {
  const props = style.split(":");
  const whiteList = [
    "color",
    "font-size",
    "font-weight",
    "background",
    "background-color",
    "font-family"
  ];

  const key = props[0].trim();
  const value = props[1];

  if (whiteList.includes(key)) {
    return (
      <div style={{ display: "flex" }}>
        <div style={{ marginRight: "16px" }}>{key}:</div>
        {CellPreview(key, value)}
      </div>
    );
  }
  return null;
};

export default ({ styles }) => (
  <View>
    {styles == null && <EmptyState {...props} />}
    {styles != null && (
      <div>
        <span>{styles.map(MapStyle)}</span>
      </div>
    )}
  </View>
);
