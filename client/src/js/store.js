import { applyMiddleware, createStore } from "redux";

import logger from "redux-logger";
import promise from "redux-promise-middleware";

import reducer from './reducers'

const middleware = applyMiddleware(promise(), logger())
// const middleware = applyMiddleware(promise())

export default createStore(reducer, middleware)
