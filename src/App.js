import './App.css';
import Editor from './Editor.js';
import { AllDocumentsList } from './AllDocumentsList';
import { useReducer, useState } from 'react';

function documentReducer(state, action) {
  switch (action.type) {
    case 'field':
      return {
        ...state,
        [action.fieldName]: action.payload,
      };
    default:
      return state;
  }
}

const initialState = {
  documentId: null,
  editorText: null,
  documentName: '',
};

function App() {
  const [documentId, setDocumentId] = useState(null);
  const [editorText, setEditorText] = useState(null);
  const [documentName, setDocumentName] = useState('');
  const [state, dispatch] = useReducer(documentReducer, initialState);
  return (
    <>
      <AllDocumentsList
        setDocumentId={setDocumentId}
        setEditorText={setEditorText}
        setDocumentName={setDocumentName}
      />
      <button
        type="button"
        onClick={() => {
          setDocumentId(null);
          setEditorText(null);
          setDocumentName('');
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
      />
    </>
  );
}

export default App;
