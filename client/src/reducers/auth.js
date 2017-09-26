import initialState from '../constants/initial-state';
import {
  LOGIN,
  LOGOUT
} from '../constants/action-types';
import {
  login,
  logout
} from '../actions';

const auth = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        authed: true,
        user: action.user
      };
    case LOGOUT:
      return {
        ...state,
        authed: false,
        user: null
      };
    default:
      return state;
  }
};

export default auth;
