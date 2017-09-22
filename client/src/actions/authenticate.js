import { AUTHENTICATE } from '../constants/action-types';

const authenticate = user => ({
  type: AUTHENTICATE,
  user
});

export default authenticate;
