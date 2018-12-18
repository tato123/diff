import React from "react";
import { serialize } from "adobexd-object-utils";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";

const application = require("application");
const fs = require("uxp").storage.localFileSystem;
const formats = require("uxp").storage.formats;

export default class Export extends React.Component {
  state = {
    savedFile: null
  };

  componentDidCatch(error) {
    console.log(error);
  }

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
      props: { selection }
    } = this;

    return (
      <div>
        <button uxp-variant="secondary" onClick={() => console.log("aww ok")}>
          Cancel
        </button>
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
              <div>Result: {data && data.uploadDesign.status}</div>
              <h1>File:{this.state.savedFile}</h1>
              <button
                uxp-variant="cta"
                onClick={() => this.exportRendition(selection, uploadDesign)}
              >
                Export
              </button>
            </React.Fragment>
          )}
        </Mutation>
      </div>
    );
  }
}
