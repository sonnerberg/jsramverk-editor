import { useEffect } from 'react';
import { EDIT, FIELD } from './documentReducer';
import { getFetchURL } from './utils/getFetchURL';
import parse from 'html-react-parser';

export function AllDocumentsList({ dispatch, allDocuments }) {
  let fetchURL = getFetchURL();
  useEffect(() => {
    fetch(fetchURL)
      .then((response) => response.json())
      .then((result) =>
        result.data
          ? dispatch({
              type: FIELD,
              fieldName: 'allDocuments',
              payload: result.data,
            })
          : console.error(result.errors.message)
      );
  }, [dispatch, fetchURL]);

  function handleClick(event, { id, name, html }) {
    event.preventDefault();
    dispatch({ type: EDIT, payload: { id, name, html } });
  }

  return (
    <div>
      {allDocuments.map(({ _id: id, name, html }) => (
        <button
          style={{
            display: 'block',
            cursor: 'pointer',
            minWidth: '500px',
            margin: 'auto',
          }}
          key={id}
          onClick={(event) => {
            handleClick(event, { id, name, html });
          }}
        >
          {parse(name)}
        </button>
      ))}
    </div>
  );
}
