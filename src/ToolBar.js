import React from 'react';
import { ClearButton } from './ClearButton';
import { SaveButton } from './SaveButton';

export function ToolBar(props) {
  return (
    <>
      <ClearButton dispatch={props.dispatch}></ClearButton>
      <SaveButton
        documentId={props.documentId}
        editorText={props.editorText}
        documentName={props.documentName}
        dispatch={props.dispatch}
      ></SaveButton>
    </>
  );
}
