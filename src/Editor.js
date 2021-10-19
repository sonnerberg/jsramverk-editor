import React from 'react';
import ReactQuill from 'react-quill';
import EditorToolbar, { modules, formats } from './EditorToolBar.js';
import 'react-quill/dist/quill.snow.css';
import { FIELD } from './documentReducer';
// import "./styles.css";

export const Editor = ({ documentId, editorText, documentName, dispatch }) => {
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
          documentName={documentName}
          editorText={editorText}
          documentId={documentId}
          dispatch={dispatch}
        />
        <input
          id="documentName"
          style={{ width: '100%' }}
          placeholder={'Insert document name'}
          type="text"
          value={documentName}
          onChange={handleDocumentNameChange}
        />
        <ReactQuill
          theme="snow"
          value={editorText}
          onChange={handleChange}
          placeholder={
            'Write something awesome or choose a saved document below...'
          }
          modules={modules}
          formats={formats}
        />
      </div>
    </>
  );
};

export default Editor;
