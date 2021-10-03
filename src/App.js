import './App.css';
import Editor from './Editor.js';
import { AllDocumentsList } from './AllDocumentsList';
import { useReducer, useState } from 'react';
import { documentReducer, initialState, RESET } from './documentReducer';

function App() {
  const [documentId, setDocumentId] = useState(null);
  const [editorText, setEditorText] = useState(null);
  const [documentName, setDocumentName] = useState('');
  const [state, dispatch] = useReducer(documentReducer, initialState);
  return (
    <>
      {state.error ? <div style={{ color: 'red' }}>{state.error}</div> : null}
      <AllDocumentsList
        // setDocumentId={setDocumentId}
        // setEditorText={setEditorText}
        // setDocumentName={setDocumentName}
        dispatch={dispatch}
        state={state}
      />
      <button
        type="button"
        onClick={() => {
          // setDocumentId(null);
          // setEditorText(null);
          // setDocumentName('');
          dispatch({ type: RESET });
        }}
      >
        New document
      </button>
      <Editor
        setDocumentId={setDocumentId}
        documentId={documentId}
        editorText={editorText}
        setEditorText={setEditorText}
        documentName={documentName}
        setDocumentName={setDocumentName}
        state={state}
        dispatch={dispatch}
      />
    </>
  );
}

export default App;
