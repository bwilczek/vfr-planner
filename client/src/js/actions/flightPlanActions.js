export function updateFlightPlan(fields) {
  return {
    type: 'UPDATE_FLIGHT_PLAN',
    payload: fields
  }
}

export function addWaypoint(waypoint) {
  return {
    type: 'ADD_WAYPOINT',
    payload: waypoint
  }
}
