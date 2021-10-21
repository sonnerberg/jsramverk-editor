import { useEffect } from 'react';
import {
  EDIT,
  ERROR,
  FIELD,
  JOIN_ROOM,
  LEAVE_ROOM,
  UPDATE_ALL_DOCUMENTS,
} from './documentReducer';
import { getFetchURL } from './utils/getFetchURL';
import parse from 'html-react-parser';
import { socket } from './socket';

export function AllDocumentsList({ dispatch, allDocuments, joinedRooms }) {
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
          : (console.error(result.errors.message),
            dispatch({ type: ERROR, payload: result.errors.message }))
      );
  }, [dispatch, fetchURL]);

  useEffect(() => {
    socket.on('newDocument', ({ id }) => {
      updateDocument(id).then((result) => {
        dispatch({
          type: UPDATE_ALL_DOCUMENTS,
          payload: { _id: id, name: result.name, html: result.html },
        });
      });
    });
  }, [dispatch]);

  async function updateDocument(id) {
    const fetchURL = `${getFetchURL()}/${id}`;
    const result = await fetch(fetchURL)
      .then((response) => response.json())
      .then((result) => result.data);
    return result;
  }

  function handleClick(event, { id, name, html }) {
    event.preventDefault();
    updateDocument(id).then((result) => {
      joinedRooms.forEach((room) => {
        if (room !== id) {
          dispatch({
            type: LEAVE_ROOM,
            payload: room,
          });
          socket.emit('leave', { room });
        }
      });

      if (!joinedRooms.includes(id)) {
        socket.emit('join', { room: id });
        dispatch({
          type: JOIN_ROOM,
          payload: id,
        });
      }
      dispatch({
        type: EDIT,
        payload: { id, name: result.name, html: result.html },
      });
      dispatch({
        type: UPDATE_ALL_DOCUMENTS,
        payload: { _id: id, name: result.name, html: result.html },
      });
    });
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
