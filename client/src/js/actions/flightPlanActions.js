import axios from 'axios'

export function updateFlightPlan(fields) {
  return {
    type: 'UPDATE_FLIGHT_PLAN',
    payload: fields
  }
}

export function addWaypoint(waypoint, position = null) {
  return {
    type: 'ADD_WAYPOINT',
    payload: { waypoint, position }
  }
}

export function updateWaypoint(waypoint) {
  return {
    type: 'UPDATE_WAYPOINT',
    payload: waypoint
  }
}

export function deleteWaypoint(waypoint) {
  return {
    type: 'DELETE_WAYPOINT',
    payload: waypoint
  }
}

export function reorderWaypoints(newWaypoints) {
  return {
    type: 'REORDER_WAYPOINTS',
    payload: newWaypoints,
  }
}

export function addWaypointWithName(waypoint, position = null) {
  return (dispatch) => {
    dispatch(addWaypoint(waypoint, position))
    dispatch(reverseGeocode(waypoint))
  }
}

export function updateWaypointWithName(waypoint) {
  console.log('updateWaypointWithName')
  return (dispatch) => {
    dispatch(updateWaypoint(waypoint))
    dispatch(reverseGeocode(waypoint))
  }
}

export function reverseGeocode(waypoint) {
  return {
    type: 'WAYPOINT_REVERSE_GEOCODE',
    payload: axios.get(`/api/nav_points/find?lat=${waypoint.latLng.lat()}&lng=${waypoint.latLng.lng()}&key=${waypoint.key}`),
  }
}
