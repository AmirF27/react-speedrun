import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';

import Header from './containers/Header.jsx';
import Timestamp from './containers/Timestamp.jsx';

ReactDOM.render((
  <BrowserRouter>
    <div>
      <Header></Header>
      <Route path='/timestamp' component={Timestamp}></Route>
    </div>
  </BrowserRouter>
  ),
  document.getElementById('root')
);
