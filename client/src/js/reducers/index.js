import { combineReducers } from 'redux'

import user from './userReducer'
import navPointList from './navPointListReducer'
import routeData from './routeDataReducer'

export default combineReducers({
  user,
  navPointList,
  routeData,
})
