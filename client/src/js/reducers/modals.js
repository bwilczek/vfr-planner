const initialState = {
  waypointToRenameKey: undefined,
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'RENAME_MODAL_SHOW': {
      return {...state, waypointToRenameKey: action.payload}
    }
    case 'RENAME_MODAL_HIDE': {
      return {...state, waypointToRenameKey: undefined}
    }
  }
  return state
}
