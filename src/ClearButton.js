import React from 'react';
import { LEAVE_ROOM, RESET, SUCCESS } from './documentReducer.js';
import { ClearDocument } from './ClearDocument.js';
import { socket } from './socket.js';
import { dispatchFlashMessage } from './dispatchFlashMessage.js';

export function ClearButton({ joinedRooms, dispatch }) {
  function leaveAllRooms() {
    joinedRooms?.forEach((room) => {
      dispatch({
        type: LEAVE_ROOM,
        payload: room,
      });
      socket.emit('leave', { room });
    });
  }
  return (
    <button // className="ql-save"
      onClick={() => {
        dispatch({
          type: RESET,
        });
        dispatchFlashMessage({
          dispatch,
          payload: 'Changes trashed, new document ready',
          type: SUCCESS,
        });
        leaveAllRooms();
      }}
    >
      <ClearDocument />
    </button>
  );
}
