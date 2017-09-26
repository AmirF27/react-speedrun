import Ajax from './ajax';

export function checkAuth(login, logout, callback) {
  Ajax.
    get('/api/user').
    then(
      function fulfilled(res) {
        if (res.user) {
          login(res.user);
        } else {
          logout();
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
