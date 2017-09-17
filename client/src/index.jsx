import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';

import Header from './containers/Header.jsx';
import Timestamp from './containers/Timestamp.jsx';
import HeaderParser from './containers/HeaderParser.jsx';
import FileUpload from './containers/FileUpload.jsx';
import VotingApp from './containers/VotingApp.jsx';
import NewPoll from './containers/NewPoll.jsx';
import Polls from './containers/Polls.jsx';

ReactDOM.render((
  <BrowserRouter>
    <div>
      <Header></Header>
      <Route path='/timestamp' component={Timestamp}></Route>
      <Route path='/header-parser' component={HeaderParser}></Route>
      <Route path='/file-upload' component={FileUpload}></Route>
      <Route path='/voting-app/new-poll' component={NewPoll}></Route>
      <Route path='/voting-app/polls' component={Polls}></Route>
    </div>
  </BrowserRouter>
  ),
  document.getElementById('root')
);
