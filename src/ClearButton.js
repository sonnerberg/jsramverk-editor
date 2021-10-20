import React from 'react';
import {
  CLEAR_SUCCESS,
  RESET,
  SUCCESS,
  TIME_FOR_CLEARING_SETTIMEOUT,
} from './documentReducer.js';
import { ClearDocument } from './ClearDocument.js';

export function ClearButton(props) {
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
