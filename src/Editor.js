import React from 'react';
import ReactQuill from 'react-quill';
import EditorToolbar, { modules, formats } from './EditorToolBar.js';
import 'react-quill/dist/quill.snow.css';
// import "./styles.css";

export const Editor = ({
  documentId,
  setDocumentId,
  editorText,
  setEditorText,
  documentName,
  setDocumentName,
}) => {
  const handleChange = (editorText) => {
    setEditorText(editorText);
  };

  const handleDocumentNameChange = ({ target: { value } }) => {
    setDocumentName(value);
  };

  return (
    <>
      <div className="text-editor">
        <EditorToolbar
          documentName={documentName}
          editorText={editorText}
          documentId={documentId}
          setDocumentId={setDocumentId}
        />
        <input
          type="text"
          value={documentName}
          onChange={handleDocumentNameChange}
        />
        <ReactQuill
          theme="snow"
          value={editorText}
          onChange={handleChange}
          placeholder={'Write something awesome...'}
          modules={modules}
          formats={formats}
        />
      </div>
    </>
  );
};

export default Editor;
