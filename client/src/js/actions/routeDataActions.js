import axios from 'axios';
import * as secrets from '../secrets';


export function addWaypoint(latLng) {
  return {
    type: 'WAYPOINT_ADDED',
    payload: latLng,
  }
}

export function updateWaypoint(waypoint) {
  return {
    type: 'WAYPOINT_UPDATE',
    payload: waypoint,
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
