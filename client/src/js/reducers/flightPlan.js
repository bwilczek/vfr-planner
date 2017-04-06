import {findIndex, cloneDeep} from 'lodash'

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
    case 'WAYPOINT_REVERSE_GEOCODE_PENDING': {
      //do nothing
      //return _.cloneDeep(state);
      break
    }
    case 'WAYPOINT_REVERSE_GEOCODE_REJECTED': {
      // ignore the error
      break
    }
    case 'WAYPOINT_REVERSE_GEOCODE_FULFILLED': {
      console.log(action.payload)
      let waypoints = cloneDeep(state.waypoints)
      let i = findIndex(waypoints, ['key', action.payload.data.key])
      waypoints[i].name = action.payload.data.name
      waypoints[i].declination = action.payload.data.declination
      return {...state, waypoints}
    }

  }
  return state
}
