import React from "react";
import SrcLogo from "./diff-logo.png";

const DiffLogo = ({ children, ...rest }) => (
  <img {...rest} src={SrcLogo} alt="diff logo" />
);

export default DiffLogo;
