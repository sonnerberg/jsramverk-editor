import React from 'react';
import {
  CLEAR_SUCCESS,
  LEAVE_ROOM,
  RESET,
  SUCCESS,
  TIME_FOR_CLEARING_SETTIMEOUT,
} from './documentReducer.js';
import { ClearDocument } from './ClearDocument.js';
import { socket } from './socket.js';

export function ClearButton(props) {
  function leaveAllRooms() {
    props.joinedRooms.forEach((room) => {
      props.dispatch({
        type: LEAVE_ROOM,
        payload: room,
      });
      socket.emit('leave', { room });
    });
  }
  return (
    <button // className="ql-save"
      onClick={() => {
        props.dispatch({
          type: RESET,
        });
        props.dispatch({
          type: SUCCESS,
          payload: 'Changes trashed, new document ready',
        });
        leaveAllRooms();
        setTimeout(() => {
          props.dispatch({
            type: CLEAR_SUCCESS,
          });
        }, TIME_FOR_CLEARING_SETTIMEOUT);
      }}
    >
      <ClearDocument />
    </button>
  );
}
