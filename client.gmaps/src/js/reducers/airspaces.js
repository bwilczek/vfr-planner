const initialState = []

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_AIRSPACES': {
      return action.payload
    }
    case 'CLEAR_AIRSPACES': {
      return []
    }
  }
  return state
}
