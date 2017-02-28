const initialState = []

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'FETCH_NAV_POINTS_PENDING': {
      return [...state]
    }
    case 'FETCH_NAV_POINTS_REJECTED': {
      console.log("TODO: add error reducer and handle this message there")
      return [...state]
    }
    case 'FETCH_NAV_POINTS_FULFILLED': {
      return action.payload.data
    }
    case 'CLEAR_NAV_POINTS': {
      return []
    }
  }
  return state
}