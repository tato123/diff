import React from "react";
import { serialize } from "adobexd-object-utils";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import PropTypes from "prop-types";
import Layout from "./Layout";
import styled from "styled-components";

const application = require("application");
const fs = require("uxp").storage.localFileSystem;
const formats = require("uxp").storage.formats;

const FormGroup = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1 auto;

  justify-content: flex-end;
  align-items: flex-end;
  margin-top: 32px;
`;

const FormLabel = styled.label`
  margin-top: 16px;

  display: flex;
  flex-direction: row;
  flex: 1 auto;
  width: 100%;

  span {
    width: 200px;
  }
`;

export default class Export extends React.Component {
  static propTypes = {
    dialog: PropTypes.object,
    selection: PropTypes.object
  };

  state = {
    savedFile: null
  };

  /**
   * Handle creating the file rendition and exporting the
   * content
   */
  exportRendition = async (selection, uploadDesign) => {
    console.log("selection", selection.items.length);
    const folder = await fs.getTemporaryFolder();

    try {
      const file = await folder.createFile("rendition.svg", {
        overwrite: true
      });

      const renditions = [
        {
          node: selection.items[0],
          outputFile: file,
          type: application.RenditionType.SVG,
          scale: 2,
          minify: false,
          embedImages: true
        }
      ];

      const results = await application.createRenditions(renditions);
      const data = await file.read({ format: formats.utf8 });

      uploadDesign({
        variables: {
          file: data,
          metaData: {
            name: "test"
          }
        }
      });

      this.setState({
        savedFile: `SVG Rendition has been saved at ${file.nativePath}`
      });
    } catch (error) {
      console.log(error);
      this.setState({
        savedFile: `Error occured ${err}`
      });
    }
  };

  render() {
    const {
      props: { selection, dialog }
    } = this;

    return (
      <Layout>
        <div style={{ width: "inherit", marginTop: "16px" }}>
          <FormLabel>
            <span>Selected Layer Name:</span>
            <label>{selection.items[0].name}</label>
          </FormLabel>

          <Mutation
            mutation={gql`
              mutation($file: Upload!, $metaData: UploadDesignMeta) {
                uploadDesign(file: $file, metaData: $metaData) {
                  status
                }
              }
            `}
          >
            {(uploadDesign, { data }) => (
              <React.Fragment>
                <div>{data && data.uploadDesign.status}</div>
                <form method="dialog">
                  <FormGroup>
                    <button
                      uxp-variant="primary"
                      onClick={() => dialog.close()}
                    >
                      Cancel
                    </button>
                    <button
                      uxp-variant="cta"
                      onClick={() =>
                        this.exportRendition(selection, uploadDesign)
                      }
                    >
                      Export
                    </button>
                  </FormGroup>
                </form>
              </React.Fragment>
            )}
          </Mutation>
        </div>
      </Layout>
    );
  }
}
