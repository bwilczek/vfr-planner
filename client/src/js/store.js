import { applyMiddleware, createStore } from 'redux'
import logger from 'redux-logger'
import promise from 'redux-promise-middleware'
import thunk from 'redux-thunk'
import { omit } from 'lodash'

import combinedReducer from './reducers'

let middleware = null;

if(process.env.NODE_ENV !== 'production') {
  middleware = applyMiddleware(promise(), thunk, require('redux-immutable-state-invariant')(), logger())
} else {
  middleware = applyMiddleware(promise(), thunk)
}

const cacheKey = 'reduxState3'
const persistedState = localStorage.getItem(cacheKey) ? JSON.parse(localStorage.getItem(cacheKey)) : undefined
// const persistedState = undefined
const store = createStore(combinedReducer, persistedState, middleware)
store.subscribe(() => {
  localStorage.setItem(cacheKey, JSON.stringify(omit(store.getState(), ['navPoints', 'user'])))
})

export default store
