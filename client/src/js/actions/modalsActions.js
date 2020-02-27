export function renameModalShow(waypointToRenameKey) {
  return {
    type: 'RENAME_MODAL_SHOW',
    payload: waypointToRenameKey
  }
}

export function renameModalHide() {
  return {
    type: 'RENAME_MODAL_HIDE',
    payload: null
  }
}

export function settingsModalShow() {
  return {
    type: 'SETTINGS_MODAL_SHOW',
    payload: null
  }
}

export function settingsModalHide() {
  return {
    type: 'SETTINGS_MODAL_HIDE',
    payload: null
  }
}

export function appendWaypointModalShow() {
  return {
    type: 'APPEND_WAYPOINT_MODAL_SHOW',
    payload: null
  }
}

export function appendWaypointModalHide() {
  return {
    type: 'APPEND_WAYPOINT_MODAL_HIDE',
    payload: null
  }
}

export function openFlightPlanModalShow() {
  return {
    type: 'FLIGHT_PLAN_OPEN_MODAL_SHOW',
    payload: null
  }
}

export function openFlightPlanModalHide() {
  return {
    type: 'FLIGHT_PLAN_OPEN_MODAL_HIDE',
    payload: null
  }
}

export function editFlightPlanModalShow() {
  return {
    type: 'FLIGHT_PLAN_EDIT_MODAL_SHOW',
    payload: null
  }
}

export function editFlightPlanModalHide() {
  return {
    type: 'FLIGHT_PLAN_EDIT_MODAL_HIDE',
    payload: null
  }
}

export function printFlightPlanModalShow() {
  return {
    type: 'FLIGHT_PLAN_PRINT_MODAL_SHOW',
    payload: null
  }
}

export function printFlightPlanModalHide() {
  return {
    type: 'FLIGHT_PLAN_PRINT_MODAL_HIDE',
    payload: null
  }
}

export function announcementModalShow() {
  return {
    type: 'ANNOUNCEMENT_MODAL_SHOW',
    payload: null
  }
}

export function announcementModalHide() {
  return {
    type: 'ANNOUNCEMENT_MODAL_HIDE',
    payload: null
  }
}
