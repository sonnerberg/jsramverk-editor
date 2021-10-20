import React from 'react';
import { saveToDatabase } from './saveToDatabase.js';
import { SaveText } from './SaveText.js';

export function SaveButton(props) {
  return (
    <button
      onClick={() => {
        saveToDatabase({
          documentName: props.documentName,
          editorText: props.editorText,
          documentId: props.documentId,
          dispatch: props.dispatch,
        });
      }}
    >
      <SaveText />
    </button>
  );
}
