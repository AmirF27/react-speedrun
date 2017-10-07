import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { Redirect } from 'react-router';
import { Provider } from 'react-redux';
import store from './store';
import Ajax from './js/ajax';
import { checkAuth } from './js/util';

require('./style.scss');

import Header from './containers/Header.jsx';
import Home from './containers/Home.jsx';
import Timestamp from './containers/Timestamp.jsx';
import HeaderParser from './containers/HeaderParser.jsx';
import FileUpload from './containers/FileUpload.jsx';
import VotingApp from './containers/VotingApp.jsx';
import NewPoll from './containers/NewPoll.jsx';
import AllPolls from './containers/AllPolls.jsx';
import Poll from './containers/Poll.jsx';
import Nightlife from './containers/Nightlife.jsx';
import StockMarket from './containers/StockMarket.jsx';
import BookTrade from './containers/BookTrade.jsx';
import BookSearch from './containers/BookSearch.jsx';
import UserProfile from './containers/UserProfile.jsx';
import UserPolls from './containers/UserPolls.jsx';
import UserBooks from './containers/UserBooks.jsx';
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
        <Route path="/stock-market" component={StockMarket} />
        <Route exact path="/book-trading-club" component={BookTrade} />
        <Route path="/book-trading-club/search" component={BookSearch} />
        <Route exact path="/profile" component={UserProfile} />
        <Route path="/profile/polls" component={UserPolls} />
        <Route path="/profile/books" component={UserBooks} />
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
      </div>
    </BrowserRouter>
  </Provider>
  ),
  document.getElementById('root')
);
