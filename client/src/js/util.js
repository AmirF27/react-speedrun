import Ajax from './ajax';
import distinctColors from 'distinct-colors';

const COLOR_COUNT = 100;

function checkAuth(login, logout, callback) {
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
}

function mapStateToProps(state) {
  return {
    checkedAuth: state.user.checkedAuth,
    authed: state.user.authed,
    user: state.user.user
  };
}

const palette = (function(count) {
  const colors = distinctColors({
    count,
    lightMin: 10,
    hueMin: 15
  });

  return colors.map(color => {
    const [r, g, b] = color._rgb;
    return `rgb(${r}, ${g}, ${b})`;
  });
})(COLOR_COUNT);

function deleteItem(array, callback) {
  const updatedArray = array.slice();
  const index = updatedArray.findIndex(callback);

  updatedArray.splice(index, 1);

  return updatedArray;
}

export {
  checkAuth,
  mapStateToProps,
  palette,
  deleteItem
};
