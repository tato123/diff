import React from "react";
import Button from "@atlaskit/button";
import styled from "styled-components";

const View = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  padding: 16px;
`;

const Toolbar = ({ count, onSave, onEdit, onShare }) => (
  <View className="toolbar">
    <div>{Object.keys(count).length || 0} changes</div>
    <div
      style={{
        justifyContent: "center",
        flex: "1 auto",
        display: "flex"
      }}
    >
      <Button onClick={onEdit}>Edit</Button>
      <Button onClick={onShare}>Share</Button>
    </div>
    <span
      style={{
        justifyContent: "flex-end",
        display: "flex"
      }}
    >
      <Button onClick={onSave}>Save</Button>
    </span>
  </View>
);

Toolbar.defaultProps = {
  count: 0,
  onSave: () => {},
  onEdit: () => {},
  onShare: () => {}
};

export default Toolbar;
