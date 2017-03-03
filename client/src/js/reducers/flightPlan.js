const initialState = {
  windSpeed: 0,
  windDirection: 0,
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_FLIGHT_PLAN': {
      return {...state, ...action.payload}
    }
  }
  return state
}
