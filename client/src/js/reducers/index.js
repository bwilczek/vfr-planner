import { combineReducers } from 'redux'

import intl from './intl'
import user from './user'
import navPoints from './navPoints'
import ui from './ui'
import google from './google'
import flightPlan from './flightPlan'

export default combineReducers({
  intl,
  user,
  navPoints,
  ui,
  flightPlan,
  google
})
