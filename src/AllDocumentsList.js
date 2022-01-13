import { useEffect } from 'react';
import {
  EDIT,
  ERROR,
  FIELD,
  JOIN_ROOM,
  LEAVE_ROOM,
  UPDATE_ALL_DOCUMENTS,
} from './documentReducer';
import parse from 'html-react-parser';
import { socket } from './socket';
import { useNavigate } from 'react-router-dom';
import { dispatchFlashMessage } from './dispatchFlashMessage';
import { sendGraphQLQuery } from './sendGraphQLQuery';

export function AllDocumentsList({
  dispatch,
  allDocuments,
  joinedRooms,
  dispatchUser,
}) {
  const navigate = useNavigate();
  useEffect(() => {
    sendGraphQLQuery({
      query: '{ documents { _id name text } }',
    })
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
              payload: result.data.documents,
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
  }, [dispatch, navigate, dispatchUser]);

  useEffect(() => {
    // TODO: Think about if this is needed. New documents cannot be shared when created.
    socket.on('newDocument', ({ id }) => {
      getSingleDocument(id).then((result) => {
        if (result) {
          dispatch({
            type: UPDATE_ALL_DOCUMENTS,
            payload: { _id: id, name: result.name, html: result.html },
          });
        }
      });
    });
  }, [dispatch]);

  function getSingleDocument(id) {
    const result = sendGraphQLQuery({
      query: `{ document(id: "${id}") {
          _id
          name
          text
        }
      }`,
    })
      .then((response) => response.json())
      .then((result) => result.data.document);
    return result;
  }

  function handleClick(event, { id }) {
    event.preventDefault();
    getSingleDocument(id).then((result) => {
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
