export function addWaypoint(latLng) {
  return {
    type: 'WAYPOINT_ADDED',
    payload: latLng,
  }
}
