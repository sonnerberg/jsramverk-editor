export const RESET_USER = 'RESET_USER';
export const LOGIN_USER = 'LOGIN_USER';

export const initialUserReducerState = {
  user: null,
};

export function userReducer(state, action) {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        user: action.payload,
      };
    case RESET_USER:
      return {
        ...state,
        user: '',
      };
    default:
      return state;
  }
}
