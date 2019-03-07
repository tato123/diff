import React from "react";
import computer from "./assets/computer.jpg";

const images = {
  computer
};

const Icon = ({ children, icon, ...rest }) => {
  return <img src={images[icon]} alt="icon" {...rest} />;
};

export default Icon;
