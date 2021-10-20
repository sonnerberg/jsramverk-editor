import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FIELD } from './documentReducer.js';

import { ClearButton } from './ClearButton';
import { SaveButton } from './SaveButton';

export const Editor = ({ documentId, editorText, documentName, dispatch }) => {
  const handleChange = (editorText) => {
    dispatch({
      type: FIELD,
      fieldName: 'editorText',
      payload: editorText,
    });
  };

  const handleDocumentNameChange = (value) => {
    const stripNewLine = value.replaceAll('<p>&nbsp;</p>', '');
    dispatch({ type: FIELD, fieldName: 'documentName', payload: stripNewLine });
  };

  return (
    <>
      <ClearButton dispatch={dispatch}></ClearButton>
      <SaveButton
        documentId={documentId}
        editorText={editorText}
        documentName={documentName}
        dispatch={dispatch}
      ></SaveButton>
      <CKEditor
        editor={ClassicEditor}
        data={documentName}
        onReady={(editor) => {
          // You can store the "editor" and use when it is needed.
          console.log('Editor is ready to use!', editor);
        }}
        // onChange={handleChange}
        onChange={(event, editor) => {
          const data = editor.getData();
          console.log({ event, editor, data });
          handleDocumentNameChange(data);
        }}
        onBlur={(event, editor) => {
          console.log('Blur.', editor);
        }}
        onFocus={(event, editor) => {
          console.log('Focus.', editor);
        }}
        config={{
          toolbar: ['bold', 'italic'],
        }}
      />
      <CKEditor
        editor={ClassicEditor}
        data={editorText}
        onReady={(editor) => {
          // You can store the "editor" and use when it is needed.
          console.log('Editor is ready to use!', editor);
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          console.log({ event, editor, data });
          handleChange(data);
        }}
        onBlur={(event, editor) => {
          console.log('Blur.', editor);
        }}
        onFocus={(event, editor) => {
          console.log('Focus.', editor);
        }}
      />
    </>
  );
};

export default Editor;
