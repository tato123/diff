import React from "react";
import SrcLogo from "./newLogo.png";

const DiffLogo = ({ size, children, ...rest }) => (
  <img
    {...rest}
    style={{ height: "auto", width: size }}
    src={SrcLogo}
    alt="diff logo"
  />
);

DiffLogo.defaultProps = {
  size: "64px"
};

export default DiffLogo;
