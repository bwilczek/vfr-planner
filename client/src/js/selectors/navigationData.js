import { createSelector } from 'reselect'

const flightPlanSelector = state => state.flightPlan

export const getNavigationData = createSelector(
  flightPlanSelector,
  (flightPlan) => {
    // TODO: read flightPlan.windDirection, flightPlan.windSpeed, flightPlan.tas and calculate bearings durations, etc
    return flightPlan.waypoints
  }
)
