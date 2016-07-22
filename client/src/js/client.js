import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'

import { Provider } from 'react-redux'

import Layout from './pages/Layout'
import Home from './pages/Home'
import Plan from './pages/Plan'
import Summary from './pages/Summary'

import store from './store'

const _ = require('lodash')

const app = document.getElementById('app')

ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/" component={Layout}>
        <IndexRoute component={Home}></IndexRoute>
        <Route path="plan(/:plan_id)" name="plan" component={Plan}></Route>
        <Route path="summary" name="summary" component={Summary}></Route>
      </Route>
    </Router>
  </Provider>,
app);
