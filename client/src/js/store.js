import { applyMiddleware, createStore } from 'redux'
import logger from 'redux-logger'
import promise from 'redux-promise-middleware'
import thunk from 'redux-thunk'
import { omit } from 'lodash'
import axios from 'axios'

import combinedReducer from './reducers'
import defaultIntlMessages from '../intl/pl.json'

let middleware = null

if (process.env.NODE_ENV !== 'production') {
  middleware = applyMiddleware(promise(), thunk, require('redux-immutable-state-invariant')(), logger())
} else {
  middleware = applyMiddleware(promise(), thunk)
}

const cacheKey = 'state_v0.5.8'
// let defaultState
let defaultState = localStorage.getItem(cacheKey) ? JSON.parse(localStorage.getItem(cacheKey)) : undefined
if (defaultState === undefined) {
  defaultState = {
    intl: {
      locale: 'pl',
      messages: defaultIntlMessages
    }
  }
} else {
  axios.defaults.headers.common['Authorization'] = defaultState.user.token
}

const store = createStore(combinedReducer, defaultState, middleware)
store.subscribe(() => {
  localStorage.setItem(cacheKey, JSON.stringify(omit(store.getState(), ['modals', 'toastr', 'navPoints', 'airspaces', 'google'])))
})

export default store
