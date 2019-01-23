import React from "react";
import ShadowDom from "./ShadowDom";
import SendMessage from "./SendMessage";
import MutationListener from "./Mutation";
import DeltaApply from './DeltaApply';

export default () => (
  <ShadowDom>
    <div>
      <DeltaApply />
      <MutationListener />
      <SendMessage>{send => <div />}</SendMessage>
    </div>
  </ShadowDom>
);
