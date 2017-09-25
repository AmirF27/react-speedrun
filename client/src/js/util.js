import Ajax from './ajax';

export function checkAuth(authenticate, unauthenticate, callback) {
  Ajax.
    get('/api/user').
    then(
      function fulfilled(res) {
        const user = JSON.parse(res).user;
        if (user) {
          authenticate(user);
        } else {
          unauthenticate();
        }
      },
      function rejected(err) {
        console.error(err);
      }
    );
};
