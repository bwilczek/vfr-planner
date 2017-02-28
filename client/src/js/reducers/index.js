import { combineReducers } from 'redux'

import intl from './intl'
import user from './user'
import navPoints from './navPoints'
import ui from './ui'

export default combineReducers({
  intl,
  user,
  navPoints,
  ui
})
