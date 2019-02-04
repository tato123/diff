import React from "react";

export default ({ children }) => {
  const send = (type, data) => {
    window.parent.postMessage(
      {
        source: "getDiff-client",
        type,
        payload: data
      },
      "*"
    );
  };

  return children(send);
};
