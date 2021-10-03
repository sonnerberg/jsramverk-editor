import { useEffect, useState } from 'react';
import { EDIT, FIELD } from './documentReducer';

export function AllDocumentsList({
  setDocumentId,
  setEditorText,
  setDocumentName,
  dispatch,
  state,
}) {
  // const [allDocuments, setAllDocuments] = useState([]);
  useEffect(() => {
    fetch('http://localhost:1337/api/v1/')
      .then((response) => response.json())
      .then((result) =>
        result.data
          ? dispatch({
              type: FIELD,
              fieldName: 'allDocuments',
              payload: result.data,
            })
          : // setAllDocuments(result.data)
            console.error(result.errors.message)
      );
  }, [dispatch]);

  function handleClick(event, { id, name, html }) {
    // setDocumentId(id);
    // setDocumentName(name);
    // setEditorText(html);
    dispatch({ type: EDIT, payload: { id, name, html } });
  }

  return (
    <div>
      {state.allDocuments.map(({ _id: id, name, html }) => (
        <div
          key={id}
          onClick={(event) => {
            handleClick(event, { id, name, html });
          }}
        >
          {name}
        </div>
      ))}
    </div>
  );
}
