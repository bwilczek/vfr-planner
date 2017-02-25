import { combineReducers } from 'redux'

import intl from './intl'
import user from './user'
import navPoints from './navPoints'

export default combineReducers({
  intl,
  user,
  navPoints
})
