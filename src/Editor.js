import React, {useState} from "react";
import ReactQuill from "react-quill";
import EditorToolbar, { modules, formats } from "./EditorToolBar.js";
import "react-quill/dist/quill.snow.css";
// import "./styles.css";

export const Editor = () => {
  const [editorText, setEditorText] = useState(null);
  const handleChange = editorText => {
    setEditorText(editorText);
  };
  return (
    <div className="text-editor">
      <EditorToolbar />
      <ReactQuill
        theme="snow"
        value={editorText}
        onChange={handleChange}
        placeholder={"Write something awesome..."}
        modules={modules}
        formats={formats}
      />
    </div>
  );
};

export default Editor;
