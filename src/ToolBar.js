import React from 'react';
import { ClearButton } from './ClearButton';
import { SaveButton } from './SaveButton';
import { ShareButton } from './ShareButton';

export function ToolBar(props) {
  return (
    <>
      <ClearButton dispatch={props.dispatch} />
      <SaveButton
        documentId={props.documentId}
        editorText={props.editorText}
        documentName={props.documentName}
        dispatch={props.dispatch}
      />
      <ShareButton documentId={props.documentId} />
    </>
  );
}
