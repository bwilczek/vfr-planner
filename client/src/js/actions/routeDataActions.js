import axios from 'axios'
import * as secrets from '../secrets'

function addWaypoint(waypoint, position = null) {
  return {
    type: 'WAYPOINT_ADDED',
    payload: { waypoint, position }
  }
}

export function addWaypointWithName(waypoint, position = null) {
  return (dispatch) => {
    dispatch(addWaypoint(waypoint, position))
    dispatch(reverseGeocode(waypoint))
  }
}

export function deleteWaypoint(waypoint) {
  return {
    type: 'WAYPOINT_DELETE',
    payload: waypoint,
  }
}

function updateWaypoint(waypoint) {
  return {
    type: 'WAYPOINT_UPDATE',
    payload: waypoint,
  }
}

export function updateWaypointWithName(waypoint) {
  return (dispatch) => {
    dispatch(updateWaypoint(waypoint))
    dispatch(reverseGeocode(waypoint))
  }
}

export function reorderWaypoints(newWaypoints) {
  return {
    type: 'WAYPOINT_REORDER',
    payload: newWaypoints,
  }
}

export function reverseGeocode(waypoint) {
  return {
    type: 'WAYPOINT_REVERSE_GEOCODE',
    payload: axios.get(`/nav_points/find?lat=${waypoint.latLng.lat()}&lng=${waypoint.latLng.lng()}&key=${waypoint.key}`),
  }
}
