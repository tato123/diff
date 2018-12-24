import React from "react";
import { Icon } from "react-icons-kit";
import { share } from "react-icons-kit/feather/share";
import styled from "styled-components";
import { darken } from "polished";

const Button = styled.button`
  background: transparent;
  outline: none;
  border: none;
  color: #7fe0e9;
  cursor: pointer;

  &:hover {
    color: ${darken(0.2, "#7fe0e9")};
  }
`;

export default ({ children, ...rest }) => (
  <Button {...rest}>
    <Icon icon={share} size={32} />
    {children}
  </Button>
);
