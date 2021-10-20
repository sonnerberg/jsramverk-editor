import {
  CLEAR_ERROR,
  ERROR,
  FIELD,
  TIME_FOR_CLEARING_SETTIMEOUT,
  UPDATE_ALL_DOCUMENTS,
} from './documentReducer';
import { getFetchURL } from './utils/getFetchURL';

export function saveToDatabase({
  documentId: id,
  documentName: name,
  editorText: html,
  dispatch,
}) {
  let requestOptions;
  let fetchURL = getFetchURL();
  if (!id) {
    fetchURL = `${fetchURL}/create`;
    requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        html,
      }),
    };
  } else {
    fetchURL = `${fetchURL}/update`;
    requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        name,
        html,
      }),
    };
  }
  const type = FIELD;
  const fieldName = 'documentId';
  fetch(fetchURL, requestOptions)
    .then((response) => response.json())
    .then((result) =>
      result.data
        ? result.data.id
          ? (dispatch({
              type,
              fieldName,
              payload: result.data.id,
            }),
            dispatch({
              type: UPDATE_ALL_DOCUMENTS,
              payload: { _id: result.data.id, name, html },
            }))
          : (dispatch({
              type,
              fieldName,
              payload: result.data.value._id,
            }),
            dispatch({
              type: UPDATE_ALL_DOCUMENTS,
              payload: { _id: result.data.value._id, name, html },
            }))
        : //  setDocumentId(result.data.id)
          (console.error(result.errors.message),
          dispatch({ type: ERROR, payload: result.errors.message }),
          setTimeout(() => {
            dispatch({ type: CLEAR_ERROR });
          }, TIME_FOR_CLEARING_SETTIMEOUT))
    )
    .catch((error) => {
      dispatch({ type: ERROR, payload: error.message });
      setTimeout(() => {
        dispatch({ type: CLEAR_ERROR });
      }, TIME_FOR_CLEARING_SETTIMEOUT);
    });
}
