import { createSelector } from 'reselect'
import { filter } from 'lodash'

const airspacesSelector = state => state.airspaces
const flightPlanSelector = state => state.flightPlan
const uiSelector = state => state.ui

export const getAirspacesForFilters = createSelector(
  airspacesSelector,
  flightPlanSelector,
  uiSelector,
  (airspaces, flightPlan, ui) => {
    let filtered = filter(airspaces, (airspace) => {
      return (airspace.level_min >= flightPlan.levels[0] && airspace.level_min <= flightPlan.levels[1]) ||
        (airspace.level_max >= flightPlan.levels[0] && airspace.level_max <= flightPlan.levels[1]) ||
        (airspace.level_min <= flightPlan.levels[0] && airspace.level_max >= flightPlan.levels[1])
    })
    if (ui.selectedAirspaces === 'today' || ui.selectedAirspaces === 'tomorrow') {
      const hoursMin = flightPlan.hours[0] * 100
      const hoursMax = flightPlan.hours[1] * 100
      filtered = filter(filtered, (airspace) => {
        return (airspace.time_from >= hoursMin && airspace.time_from <= hoursMax) ||
          (airspace.time_to >= hoursMin && airspace.time_to <= hoursMax) ||
          (airspace.time_from <= hoursMin && airspace.time_to >= hoursMax)
      })
    }
    return filtered
  }
)
