import initialState from '../constants/initial-state';
import {
  AUTHENTICATE,
  UNAUTHENTICATE
} from '../constants/action-types';
import {
  authenticate,
  unauthenticate
} from '../actions';

const auth = (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE:
      return {
        ...state,
        checkedAuth: true,
        authed: true,
        user: action.user
      };
    case UNAUTHENTICATE:
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
