import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { Redirect } from 'react-router';

import Ajax from './js/ajax';

import Header from './containers/Header.jsx';
import Timestamp from './containers/Timestamp.jsx';
import HeaderParser from './containers/HeaderParser.jsx';
import FileUpload from './containers/FileUpload.jsx';
import VotingApp from './containers/VotingApp.jsx';
import NewPoll from './containers/NewPoll.jsx';
import AllPolls from './containers/AllPolls.jsx';
import Poll from './containers/Poll.jsx';
import Register from './containers/Register.jsx';
import Login from './containers/Login.jsx';

ReactDOM.render((
  <BrowserRouter>
    <div>
      <Header></Header>
      <Route path="/timestamp" component={Timestamp} />
      <Route path="/header-parser" component={HeaderParser} />
      <Route path="/file-upload" component={FileUpload} />
      <Route path="/voting-app/new-poll" component={NewPoll} />
      <Route path="/voting-app/all-polls" component={AllPolls} />
      <Route path="/voting-app/poll/:title" component={Poll} />
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
    </div>
  </BrowserRouter>
  ),
  document.getElementById('root')
);
