import { applyMiddleware, createStore } from 'redux'
import logger from 'redux-logger'
import promise from 'redux-promise-middleware'
import thunk from 'redux-thunk'
import { omit } from 'lodash'
import defaultIntlMessage from '../intl/pl.json'

import combinedReducer from './reducers'

let middleware = null;

if(process.env.NODE_ENV !== 'production') {
  middleware = applyMiddleware(promise(), thunk, require('redux-immutable-state-invariant')(), logger())
} else {
  middleware = applyMiddleware(promise(), thunk)
}

const cacheKey = 'reduxState_v5'
let defaultState = localStorage.getItem(cacheKey) ? JSON.parse(localStorage.getItem(cacheKey)) : undefined
// let defaultState = undefined
if(defaultState == undefined) {
  defaultState = {
    intl: {
      locale: 'pl',
      message: JSON
    }
  }
}
const store = createStore(combinedReducer, defaultState, middleware)
store.subscribe(() => {
  localStorage.setItem(cacheKey, JSON.stringify(omit(store.getState(), ['navPoints', 'user', 'google'])))
})

export default store
