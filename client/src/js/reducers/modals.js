const initialState = {
  waypointToRenameKey: undefined,
  settingsOpen: false,
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'RENAME_MODAL_SHOW': {
      return {...state, waypointToRenameKey: action.payload}
    }
    case 'RENAME_MODAL_HIDE': {
      return {...state, waypointToRenameKey: undefined}
    }
    case 'SETTINGS_MODAL_SHOW': {
      return {...state, settingsOpen: true}
    }
    case 'SETTINGS_MODAL_HIDE': {
      return {...state, settingsOpen: false}
    }
  }
  return state
}
