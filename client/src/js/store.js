import { applyMiddleware, createStore } from 'redux'
// import logger from 'redux-logger'
import promise from 'redux-promise-middleware'
import thunk from 'redux-thunk'

import combinedReducer from './reducers'

let middleware = null;

if(process.env.NODE_ENV !== 'production') {
  middleware = applyMiddleware(promise(), thunk, require('redux-immutable-state-invariant')())
} else {
  middleware = applyMiddleware(promise(), thunk)
}

// TODO: evaluate replacing with localforage
const cacheKey = 'reduxState3'
const persistedState = localStorage.getItem(cacheKey) ? JSON.parse(localStorage.getItem(cacheKey)) : undefined
const store = createStore(combinedReducer, persistedState, middleware)
store.subscribe(() => {
  // TODO: reject certain keys that don't need to be stored
  localStorage.setItem(cacheKey, JSON.stringify(store.getState()))
})

export default store
