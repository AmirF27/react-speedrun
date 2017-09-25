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
      },
      function rejected(err) {
        console.error(err);
      }
    );
};
