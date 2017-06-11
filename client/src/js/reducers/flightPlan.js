import {findIndex, cloneDeep, remove} from 'lodash'

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
      let waypoints = null
      if (action.payload.position == null) {
        waypoints = [...state.waypoints, action.payload.waypoint]
      } else {
        waypoints = cloneDeep(state.waypoints)
        waypoints.splice(action.payload.position, 0, action.payload.waypoint)
      }
      return {...state, waypoints}
    }
    case 'UPDATE_WAYPOINT': {
      let waypoints = cloneDeep(state.waypoints)
      let i = findIndex(waypoints, ['key', action.payload.key])
      waypoints[i] = action.payload
      return {...state, waypoints}
    }
    case 'DELETE_WAYPOINT': {
      let waypoints = cloneDeep(state.waypoints)
      remove(waypoints, (wp) => {
        return wp.key === action.payload.key
      })
      return {...state, waypoints}
    }
    case 'REORDER_WAYPOINTS': {
      return {...state, waypoints: action.payload}
    }
    case 'WAYPOINT_REVERSE_GEOCODE_PENDING': {
      // do nothing
      // return _.cloneDeep(state);
      break
    }
    case 'WAYPOINT_REVERSE_GEOCODE_REJECTED': {
      // ignore the error
      break
    }
    case 'WAYPOINT_REVERSE_GEOCODE_FULFILLED': {
      let waypoints = cloneDeep(state.waypoints)
      let i = findIndex(waypoints, ['key', action.payload.data.key])
      waypoints[i].name = action.payload.data.name
      waypoints[i].declination = action.payload.data.declination
      return {...state, waypoints}
    }

  }
  return state
}
