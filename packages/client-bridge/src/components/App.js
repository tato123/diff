import React from "react";
import ShadowDom from "./ShadowDom";
import SelectElement from "./Highlight";

export default () => (
  <ShadowDom>
    <div>
      <div>test</div>
      <SelectElement
        onSelect={values => {
          console.log("selected", values);
        }}
        onCancel={() => {
          console.log("canceled");
        }}
      />
    </div>
  </ShadowDom>
);
