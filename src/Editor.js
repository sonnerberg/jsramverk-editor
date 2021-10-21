import React, { useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FIELD, UPDATE_ALL_DOCUMENTS } from './documentReducer.js';

import { socket } from './socket.js';
import { ToolBar } from './ToolBar';

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

  const emitDocument = () => {
    socket.emit('doc', {
      id: documentId,
      name: documentName,
      editorText,
    });

    if (documentId) {
      dispatch({
        type: UPDATE_ALL_DOCUMENTS,
        payload: { _id: documentId, name: documentName, html: editorText },
      });
    }
  };

  useEffect(() => {
    socket.on('doc', (data) => {
      dispatch({
        type: UPDATE_ALL_DOCUMENTS,
        payload: { _id: data.id, name: data.name, html: data.editorText },
      });
      if (data.hasOwnProperty('editorText')) {
        dispatch({
          type: FIELD,
          fieldName: 'editorText',
          payload: data.editorText,
        });
      }
      if (data.hasOwnProperty('name')) {
        dispatch({
          type: FIELD,
          fieldName: 'documentName',
          payload: data.name,
        });
      }
    });
  }, [dispatch]);

  return (
    <>
      <ToolBar
        documentId={documentId}
        editorText={editorText}
        documentName={documentName}
        dispatch={dispatch}
      />
      <div onKeyUp={emitDocument}>
        <CKEditor
          editor={ClassicEditor}
          data={documentName}
          onChange={(_event, editor) => {
            const data = editor.getData();
            handleDocumentNameChange(data);
          }}
          config={{
            toolbar: ['bold', 'italic'],
          }}
        />
      </div>
      <div onKeyUp={emitDocument}>
        <CKEditor
          editor={ClassicEditor}
          data={editorText}
          onChange={(_event, editor) => {
            const data = editor.getData();
            handleChange(data);
          }}
        />
      </div>
    </>
  );
};

export default Editor;
