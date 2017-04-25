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
