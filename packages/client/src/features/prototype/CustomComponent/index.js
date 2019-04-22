import React from "react";
import MonacoEditor from "react-monaco-editor";

const CustomComponent = ({ onChange, value }) => {
  const options = {};

  const onTextboxChange = value => {
    onChange(value);
  };

  return (
    <div className="editor" style={{ height: 500 }}>
      <MonacoEditor
        width="100%"
        height="90%"
        language="css"
        theme="vs-light"
        options={options}
        value={value}
        editorDidMount={editor => editor.focus()}
        onChange={onTextboxChange}
      />
    </div>
  );
};

export default CustomComponent;
