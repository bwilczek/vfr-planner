import { combineReducers } from 'redux'
import { reducer as toastr } from 'react-redux-toastr'

import intl from './intl'
import user from './user'
import navPoints from './navPoints'
import ui from './ui'
import google from './google'
import flightPlan from './flightPlan'
import modals from './modals'
import airspaces from './airspaces'
import printSettings from './printSettings'

export default combineReducers({
  intl,
  toastr,
  user,
  navPoints,
  ui,
  flightPlan,
  google,
  modals,
  airspaces,
  printSettings
})
