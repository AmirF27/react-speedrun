import { LOGIN } from '../constants/action-types';

const login = user => ({
  type: LOGIN,
  user
});

export default login;
