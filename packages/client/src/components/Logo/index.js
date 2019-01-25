import React from "react";
import SrcLogo from "./newLogo.png";

const DiffLogo = ({ children, ...rest }) => (
  <img {...rest} src={SrcLogo} alt="diff logo" />
);

export default DiffLogo;
