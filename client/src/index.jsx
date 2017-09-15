import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';

import Header from './containers/Header.jsx';
import Timestamp from './containers/Timestamp.jsx';
import HeaderParser from './containers/HeaderParser.jsx';
import FileUpload from './containers/FileUpload.jsx';

ReactDOM.render((
  <BrowserRouter>
    <div>
      <Header></Header>
      <Route path='/timestamp' component={Timestamp}></Route>
      <Route path='/header-parser' component={HeaderParser}></Route>
      <Route path='/file-upload' component={FileUpload}></Route>
    </div>
  </BrowserRouter>
  ),
  document.getElementById('root')
);
