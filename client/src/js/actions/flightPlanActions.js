export function updateFlightPlan(fields) {
  return {
    type: 'UPDATE_FLIGHT_PLAN',
    payload: fields
  }
}
