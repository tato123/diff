import React from "react";
import SendMessage from "./SendMessage";
import MutationListener from "./Mutation";
import DeltaApply from "./DeltaApply";

export default () => (
  <div>
    <DeltaApply />
    <MutationListener />
    <SendMessage>{send => <div />}</SendMessage>
  </div>
);
