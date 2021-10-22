import './App.css';
import Editor from './Editor.js';
import { AllDocumentsList } from './AllDocumentsList';
import { useReducer } from 'react';
import { documentReducer, initialState } from './documentReducer';
import { ErrorMessage } from './ErrorMessage';
import { SuccessMessage } from './SuccessMessage';

function App() {
  const [
    {
      documentId,
      editorText,
      documentName,
      allDocuments,
      success,
      error,
      joinedRooms,
    },
    dispatch,
  ] = useReducer(documentReducer, initialState);

  return (
    <>
      {error ? <ErrorMessage error={error} /> : null}
      {success ? <SuccessMessage success={success} /> : null}
      <Editor
        documentId={documentId}
        editorText={editorText}
        documentName={documentName}
        dispatch={dispatch}
        joinedRooms={joinedRooms}
      />
      <AllDocumentsList
        dispatch={dispatch}
        allDocuments={allDocuments}
        joinedRooms={joinedRooms}
      />
    </>
  );
}

export default App;
