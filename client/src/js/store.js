import { applyMiddleware, createStore } from 'redux'
import logger from 'redux-logger'
import promise from 'redux-promise-middleware'
import thunk from 'redux-thunk'
import { omit } from 'lodash'

import combinedReducer from './reducers'
import defaultIntlMessages from '../intl/pl.json'

let middleware = null

if (process.env.NODE_ENV !== 'production') {
  middleware = applyMiddleware(promise(), thunk, require('redux-immutable-state-invariant')(), logger())
} else {
  middleware = applyMiddleware(promise(), thunk)
}

const cacheKey = 'reduxState_v6'
let defaultState = localStorage.getItem(cacheKey) ? JSON.parse(localStorage.getItem(cacheKey)) : undefined
if (defaultState === undefined) {
  defaultState = {
    intl: {
      locale: 'pl',
      messages: defaultIntlMessages
    }
  }
}

const store = createStore(combinedReducer, defaultState, middleware)
store.subscribe(() => {
  localStorage.setItem(cacheKey, JSON.stringify(omit(store.getState(), ['navPoints', 'airspaces', 'user', 'google'])))
})

export default store
