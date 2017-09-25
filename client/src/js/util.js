import Ajax from './ajax';

export function checkAuth(authenticate, unauthenticate, callback) {
  Ajax.
    get('/api/user').
    then(
      function fulfilled(res) {
        if (res.user) {
          authenticate(res.user);
        } else {
          unauthenticate();
        }
        if (callback) callback();
      },
      function rejected(err) {
        console.error(err);
      }
    );
};

export function mapStateToProps(state) {
  return {
    checkedAuth: state.auth.checkedAuth,
    authed: state.auth.authed,
    user: state.auth.user
  };
};
