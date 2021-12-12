import Editor from './Editor.js';
import { AllDocumentsList } from './AllDocumentsList';

export function TextEditor({
  documentId,
  editorText,
  documentName,
  dispatch,
  joinedRooms,
  allDocuments,
  dispatchUser,
}) {
  return (
    <>
      {/* TODO: Check if user is defined before rendering editor */}
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
        dispatchUser={dispatchUser}
      />
    </>
  );
}
