import { dispatchFlashMessage } from './dispatchFlashMessage';
import {
  ERROR,
  FIELD,
  JOIN_ROOM,
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
  let requestOptions = {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  };
  let fetchURL = `${getFetchURL()}/api/v1`;
  if (!id) {
    fetchURL = `${fetchURL}/create`;
    requestOptions = {
      ...requestOptions,
      ...{
        method: 'POST',
        body: JSON.stringify({
          name,
          html,
        }),
      },
    };
  } else {
    fetchURL = `${fetchURL}/update`;
    requestOptions = {
      ...requestOptions,
      ...{
        method: 'PUT',
        body: JSON.stringify({
          id,
          name,
          html,
        }),
      },
    };
  }
  fetch(fetchURL, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      return result.data
        ? result.data?.insertedDocument._id
          ? // Create a new document
            (dispatch({
              type: FIELD,
              fieldName: 'documentId',
              payload: result.data.insertedDocument._id,
            }),
            dispatch({
              type: UPDATE_ALL_DOCUMENTS,
              payload: { _id: result.data.insertedDocument._id, name, html },
            }),
            socket.emit('join', { room: result.data.insertedDocument._id }),
            dispatch({
              type: JOIN_ROOM,
              payload: result.data.insertedDocument._id,
            }))
          : // Update existing document
            (dispatch({
              type: FIELD,
              fieldName: 'documentId',
              payload: result.data.insertedDocument._id,
            }),
            dispatch({
              type: UPDATE_ALL_DOCUMENTS,
              payload: { _id: result.data.insertedDocument._id, name, html },
            }))
        : (console.error(result.errors.message),
          dispatchFlashMessage({
            dispatch,
            payload: result.errors.message,
            type: ERROR,
          }));
    })
    .catch((error) => {
      // Mostly no reason to show a message if this errors.
      // console.error('catching error', error);
      // dispatchFlashMessage({
      //   dispatch,
      //   payload: error.message,
      //   type: ERROR,
      // });
    });
}
