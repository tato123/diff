import React from "react";
import ShadowDom from "./ShadowDom";
import SendMessage from "./SendMessage";
import MutationListener from "./Mutation";

export default () => (
  <ShadowDom>
    <div>
      <MutationListener />
      <SendMessage>{send => <div />}</SendMessage>
    </div>
  </ShadowDom>
);
