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

const store = createStore(combinedReducer, middleware)

export default store
