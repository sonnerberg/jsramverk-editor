import React from 'react';
import ReactQuill from 'react-quill';
import EditorToolbar, { modules, formats } from './EditorToolBar.js';
import 'react-quill/dist/quill.snow.css';
import { FIELD } from './documentReducer';
// import "./styles.css";

export const Editor = ({ setDocumentId, state, dispatch }) => {
  const handleChange = (editorText) => {
    dispatch({
      type: FIELD,
      fieldName: 'editorText',
      payload: editorText,
    });
  };

  const handleDocumentNameChange = ({ target: { value } }) => {
    dispatch({ type: FIELD, fieldName: 'documentName', payload: value });
  };

  return (
    <>
      <div className="text-editor">
        <EditorToolbar
          documentName={state.documentName}
          editorText={state.editorText}
          documentId={state.documentId}
          setDocumentId={setDocumentId}
          dispatch={dispatch}
        />
        <input
          type="text"
          value={state.documentName}
          onChange={handleDocumentNameChange}
        />
        <ReactQuill
          theme="snow"
          value={state.editorText}
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
