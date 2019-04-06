import React from "features/prototype/toolbar/react";
import Button from "features/prototype/toolbar/@atlaskit/button";
import styled from "features/prototype/toolbar/styled-components";


const View = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  padding: 16px;
`;

const Avatar = styled.img`
width: 32px;
height: 32px;
border-radius: 50%;
`

const Toolbar = ({ count, onSave, onEdit, onShare, onClickChanges, isLoggedIn, userImage }) => (
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
      <Button onClick={onSave} isDisabled={count === 0} appearance="primary">
        Save Changes
      </Button>
      {isLoggedIn && (
        <a href="/account">
          <Avatar src={userImage} />
        </a>
      )}
      {!isLoggedIn && (
        <a href="/login">login</a>
      )}
    </div>
  </View>
);

Toolbar.defaultProps = {
  count: 0,
  onSave: () => { },
  onEdit: () => { },
  onShare: () => { },
  onClickChanges: () => { }
};

export default Toolbar;
