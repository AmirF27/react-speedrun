import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapStateToProps } from '../js/util';

class UserProfile extends Component {
  render() {
    return (
      <main className="container">
        <Link to={`/profile/${this.props.match.params.email}/polls`}>Polls</Link>
      </main>
    );
  }
}

export default connect(
  mapStateToProps
)(UserProfile);
