import {
  CLEAR_ERROR,
  CLEAR_SUCCESS,
  ERROR,
  TIME_FOR_CLEARING_SETTIMEOUT,
} from './documentReducer';

export function dispatchFlashMessage({ dispatch, payload, type }) {
  dispatch({ type, payload });
  setTimeout(() => {
    dispatch({
      type: type === ERROR ? CLEAR_ERROR : CLEAR_SUCCESS,
    });
  }, TIME_FOR_CLEARING_SETTIMEOUT);
}
