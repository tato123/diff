import React from "react";
import Button from "@atlaskit/button";
import styled from "styled-components";

const View = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  padding: 16px;
`;

const Toolbar = ({ count, onSave, onEdit, onShare, onClickChanges }) => (
  <View className="toolbar">
    <div>
      <div>{count} elements have modified styles</div>
    </div>
    <div
      style={{
        justifyContent: "center",
        flex: "1 auto",
        display: "flex",
        marginLeft: "-10%"
      }}
    >
      {/* <Button onClick={onShare} appearence="link">
        Save to workspace
      </Button> */}
      <Button onClick={onSave} isDisabled={count === 0} appearance="primary">
        Save Changes
      </Button>
    </div>
  </View>
);

Toolbar.defaultProps = {
  count: 0,
  onSave: () => {},
  onEdit: () => {},
  onShare: () => {},
  onClickChanges: () => {}
};

export default Toolbar;
