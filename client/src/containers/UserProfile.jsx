import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

class UserProfile extends Component {
  render() {
    return (
      <main>
        <Link to={`/profile/${this.props.match.params.email}/polls`}>Polls</Link>
      </main>
    );
  }
}

const mapStateToProps = state => {
  return {
    authed: state.auth.authed,
    user: state.auth.user
  };
};

export default connect(
  mapStateToProps
)(UserProfile);
