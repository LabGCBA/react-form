'use strict';

import 'styles/blaze.min.css';
import 'styles/Form.scss';
import 'styles/Menu.scss';
import 'styles/main.scss';

import 'config/firebase.js';

import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router'

import Index from 'components/Index/Index';
import NotFound from 'components/NotFound/NotFound';

render((
  <Router history={browserHistory}>
    <Route path="/" component={NotFound}/>
    <Route path="/nuevo" component={Index}/>
    <Route path="*"s component={NotFound}/>
  </Router>
), document.getElementById('js-main'));
