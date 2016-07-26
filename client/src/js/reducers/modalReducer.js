const _ = require('lodash')

const emptyWaypoint = {name: '---'}

const initialState = {
  showContact: false,
  showRename: false,
  waypoint: emptyWaypoint,
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'MODAL_SHOW_CONTACT': {
      return {...state, showContact: true}
    }
    case 'MODAL_HIDE_CONTACT': {
      return {...state, showContact: false}
    }
    case 'MODAL_SHOW_RENAME': {
      return {...state, showRename: true, waypoint: action.payload}
    }
    case 'MODAL_HIDE_RENAME': {
      return {...state, showRename: false, waypoint: emptyWaypoint}
    }
  }
  return state
}
