import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute, hashHistory } from "react-router";
import { applyMiddleware, createStore, combineReducers } from "redux";
import { Provider } from 'react-redux'
import logger from "redux-logger";
import promise from "redux-promise-middleware";

import { reducers } from './reducers/AllReducers'

// import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Plan from "./pages/Plan";
import Summary from "./pages/Summary";

const _ = require('lodash');

const middleware = applyMiddleware(promise(), logger())
// const middleware = applyMiddleware(promise())

let store = createStore(combineReducers(reducers), middleware)

const app = document.getElementById('app');

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
