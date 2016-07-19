import axios from 'axios';
import * as secrets from '../secrets';


export function addWaypoint(latLng) {
  return {
    type: 'WAYPOINT_ADDED',
    payload: latLng,
  }
}

export function reorderWaypoints(newWaypoints) {
  return {
    type: 'WAYPOINT_REORDER',
    payload: newWaypoints,
  }
}

export function reverseGeocode(latLng) {
  return {
    type: 'WAYPOINT_REVERSE_GEOCODE',
    payload: axios.get(`/nav_points/find?lat=${latLng.lat()}&lng=${latLng.lng()}`),
  }
}
