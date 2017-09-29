import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { Redirect } from 'react-router';
import { Provider } from 'react-redux';
import store from './store';
import Ajax from './js/ajax';
import { checkAuth } from './js/util';

import Header from './containers/Header.jsx';
import Home from './containers/Home.jsx';
import Timestamp from './containers/Timestamp.jsx';
import HeaderParser from './containers/HeaderParser.jsx';
import FileUpload from './containers/FileUpload.jsx';
import VotingApp from './containers/VotingApp.jsx';
import NewPoll from './containers/NewPoll.jsx';
import AllPolls from './containers/AllPolls.jsx';
import Nightlife from './containers/Nightlife.jsx';
import Poll from './containers/Poll.jsx';
import UserProfile from './containers/UserProfile.jsx';
import UserPolls from './containers/UserPolls.jsx';
import Register from './containers/Register.jsx';
import Login from './containers/Login.jsx';

ReactDOM.render((
  <Provider store={store}>
    <BrowserRouter>
      <div>
        <Header></Header>
        <Route exact path="/" component={Home}></Route>
        <Route path="/timestamp" component={Timestamp} />
        <Route path="/header-parser" component={HeaderParser} />
        <Route path="/file-upload" component={FileUpload} />
        <Route exact path="/voting-app" component={VotingApp} />
        <Route path="/voting-app/new-poll" component={NewPoll} />
        <Route path="/voting-app/all-polls" component={AllPolls} />
        <Route path="/voting-app/poll/:title" component={Poll} />
        <Route path="/nightlife" component={Nightlife} />
        <Route exact path="/profile" component={UserProfile} />
        <Route path="/profile/polls" component={UserPolls} />
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
      </div>
    </BrowserRouter>
  </Provider>
  ),
  document.getElementById('root')
);

require('./style.scss');
