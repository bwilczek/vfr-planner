import { combineReducers } from 'redux'

import user from './userReducer'
import modal from './modalReducer'
import navPointList from './navPointListReducer'
import routeData from './routeDataReducer'

export default combineReducers({
  user,
  navPointList,
  routeData,
  modal,
})
