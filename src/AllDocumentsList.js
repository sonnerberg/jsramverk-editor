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
import { useNavigate } from 'react-router-dom';
import { dispatchFlashMessage } from './dispatchFlashMessage';

export function AllDocumentsList({
  dispatch,
  allDocuments,
  joinedRooms,
  dispatchUser,
}) {
  const navigate = useNavigate();
  let fetchURL = `${getFetchURL()}/api/v1`;
  useEffect(() => {
    fetch(fetchURL, { credentials: 'include' })
      .then((response) => {
        if (
          response.status === 404 &&
          response.redirected === true &&
          response.statusText === 'Not Found'
        ) {
          // Will go to .catch
          return;
        } else return response.json();
      })
      .then((result) =>
        result.data
          ? dispatch({
              type: FIELD,
              fieldName: 'allDocuments',
              payload: result.data,
            })
          : (console.error(result.errors.message),
            dispatch({ type: ERROR, payload: result.errors.message }))
      )
      .catch(() => {
        dispatchFlashMessage({
          dispatch,
          payload: 'Need to be logged in to use editor',
          type: ERROR,
        });
        navigate('/login');
      });
  }, [dispatch, fetchURL, navigate, dispatchUser]);

  useEffect(() => {
    // TODO: Think about if this is needed. New documents cannot be shared when created.
    socket.on('newDocument', ({ id }) => {
      updateDocument(id).then((result) => {
        if (result) {
          dispatch({
            type: UPDATE_ALL_DOCUMENTS,
            payload: { _id: id, name: result.name, html: result.html },
          });
        }
      });
    });
  }, [dispatch]);

  function updateDocument(id) {
    const fetchURL = `${getFetchURL()}/api/v1/${id}`;
    const result = fetch(fetchURL, { credentials: 'include' })
      .then((response) => response.json())
      .then((result) => result.data);
    return result;
  }

  function handleClick(event, { id }) {
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
        payload: { id, name: result.name, html: result.text },
      });
      dispatch({
        type: UPDATE_ALL_DOCUMENTS,
        payload: { _id: id, name: result.name, html: result.text },
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
