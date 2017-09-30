import initialState from '../constants/initial-state';
import {
  LOGIN,
  LOGOUT,
  ADD_BAR,
  REMOVE_BAR
} from '../constants/action-types';
import {
  login,
  logout,
  addBar,
  removeBar
} from '../actions';

const user = (state = initialState, action) => {
  let newBars;

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
    case ADD_BAR:
      newBars = state.user.bars.slice();
      newBars.push(action.bar);
      return {
        ...state,
        user: {
          ...state.user,
          bars: newBars
        }
      };
    case REMOVE_BAR:
      newBars = state.user.bars.slice();
      newBars.splice(newBars.indexOf(action.id), 1);
      return {
        ...state,
        user: {
          ...state.user,
          bars: newBars
        }
      };
    default:
      return state;
  }
};

export default user;
