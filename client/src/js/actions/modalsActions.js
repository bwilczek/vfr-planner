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
