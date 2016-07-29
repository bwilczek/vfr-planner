require('rc-slider/assets/index.css')

import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'

import { Provider } from 'react-redux'

import Layout from './pages/Layout'
import Plan from './pages/Plan'
import StaticPage from './pages/StaticPage'

import store from './store'

const _ = require('lodash')

const app = document.getElementById('app')

ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/(:plan_id)" component={Layout}>
        <IndexRoute component={Plan}></IndexRoute>
        <Route path="/static(/:page)" name="static" component={StaticPage}></Route>
      </Route>
    </Router>
  </Provider>,
app);
