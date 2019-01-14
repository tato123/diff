import React from "react";
import ShadowDom from "./ShadowDom";
import SendMessage from "./SendMessage";

export default () => (
  <ShadowDom>
    <div>
      <SendMessage>{send => <div />}</SendMessage>
    </div>
  </ShadowDom>
);
