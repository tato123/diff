import React from "react";
import jsonTool from "../json";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";

const fakeData = {
  name: "test",
  type: "Text"
};

const Export = ({ selection }) => (
  <div>
    <button uxp-variant="secondary" onClick={() => console.log("aww ok")}>
      Cancel
    </button>
    <Mutation
      mutation={gql`
        mutation($input: UploadDesignInput!) {
          uploadDesign(input: $input) {
            status
          }
        }
      `}
    >
      {mutate => (
        <button
          uxp-variant="cta"
          onClick={() =>
            mutate({
              variables: {
                input: {
                  name: "test",
                  upload: jsonTool(selection)
                }
              }
            })
          }
        >
          Export
        </button>
      )}
    </Mutation>
  </div>
);

export default Export;
