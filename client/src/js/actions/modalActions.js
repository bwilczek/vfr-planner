// import axios from 'axios'

export function showContact() {
  return {
    type: 'MODAL_SHOW_CONTACT',
    payload: {},
  }
}

export function hideContact() {
  return {
    type: 'MODAL_HIDE_CONTACT',
    payload: {},
  }
}

export function showRename(waypoint) {
  return {
    type: 'MODAL_SHOW_RENAME',
    payload: waypoint,
  }
}

export function hideRename() {
  return {
    type: 'MODAL_HIDE_RENAME',
    payload: {},
  }
}
