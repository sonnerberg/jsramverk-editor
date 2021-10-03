import './App.css';
import Editor from './Editor.js';
import { AllDocumentsList } from './AllDocumentsList';
import { useReducer } from 'react';
import { documentReducer, initialState } from './documentReducer';

function App() {
  const [
    { documentId, editorText, documentName, allDocuments, success, error },
    dispatch,
  ] = useReducer(documentReducer, initialState);
  return (
    <>
      {error ? (
        <div
          style={{
            color: 'red',
            position: 'absolute',
            top: '0',
            marginLeft: 'auto',
            marginRight: 'auto',
            left: 0,
            right: 0,
            textAlign: 'center',
          }}
        >
          {error}
        </div>
      ) : null}
      {success ? (
        <div
          style={{
            color: 'green',
            position: 'absolute',
            top: '0',
            marginLeft: 'auto',
            marginRight: 'auto',
            left: 0,
            right: 0,
            textAlign: 'center',
          }}
        >
          {success}
        </div>
      ) : null}
      <Editor
        documentId={documentId}
        editorText={editorText}
        documentName={documentName}
        dispatch={dispatch}
      />
      <AllDocumentsList dispatch={dispatch} allDocuments={allDocuments} />
    </>
  );
}

export default App;
