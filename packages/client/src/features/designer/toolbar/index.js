import React from "react";
import Button from "@atlaskit/button";
import styled from "styled-components";
import Auth from '../../../utils/auth'

const auth = new Auth();

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
        <Avatar src={userImage} />
      )}
      {!isLoggedIn && (
        <a href="/login">login</a>
      )}
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
