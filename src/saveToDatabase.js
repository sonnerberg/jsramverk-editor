import {
  CLEAR_ERROR,
  ERROR,
  FIELD,
  JOIN_ROOM,
  TIME_FOR_CLEARING_SETTIMEOUT,
  UPDATE_ALL_DOCUMENTS,
} from './documentReducer';
import { socket } from './socket';
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
  fetch(fetchURL, requestOptions)
    .then((response) => response.json())
    .then((result) =>
      result.data
        ? result.data.id
          ? // Create a new document
            (dispatch({
              type: FIELD,
              fieldName: 'documentId',
              payload: result.data.id,
            }),
            dispatch({
              type: UPDATE_ALL_DOCUMENTS,
              payload: { _id: result.data.id, name, html },
            }),
            socket.emit('join', { room: result.data.id }),
            dispatch({
              type: JOIN_ROOM,
              payload: result.data.id,
            }),
            socket.emit('newDocument', { id: result.data.id }))
          : // Update existing document
            (dispatch({
              type: FIELD,
              fieldName: 'documentId',
              payload: result.data.value._id,
            }),
            dispatch({
              type: UPDATE_ALL_DOCUMENTS,
              payload: { _id: result.data.value._id, name, html },
            }))
        : (console.error(result.errors.message),
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
