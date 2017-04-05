const initialState = {
  windSpeed: 0,
  windDirection: 0,
  tas: 70,
  waypoints: []
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_FLIGHT_PLAN': {
      return {...state, ...action.payload}
    }
    case 'ADD_WAYPOINT': {
      const waypoints = [...state.waypoints, action.payload]
      return {...state, waypoints}
    }
  }
  return state
}
