import { createSelector } from 'reselect'
import { filter } from 'lodash'

const airspacesSelector = state => state.airspaces
const uiSelector = state => state.ui

export const getAirspacesForFilters = createSelector(
  airspacesSelector,
  uiSelector,
  (airspaces, ui) => {
    let filtered = filter(airspaces, (airspace) => {
      return (airspace.level_min >= ui.levels[0] && airspace.level_min <= ui.levels[1]) ||
        (airspace.level_max >= ui.levels[0] && airspace.level_max <= ui.levels[1]) ||
        (airspace.level_min <= ui.levels[0] && airspace.level_max >= ui.levels[1])
    })
    if (ui.selectedAirspaces === 'today' || ui.selectedAirspaces === 'tomorrow') {
      const hoursMin = ui.hours[0] * 100
      const hoursMax = ui.hours[1] * 100
      filtered = filter(filtered, (airspace) => {
        return (airspace.time_from >= hoursMin && airspace.time_from <= hoursMax) ||
          (airspace.time_to >= hoursMin && airspace.time_to <= hoursMax) ||
          (airspace.time_from <= hoursMin && airspace.time_to >= hoursMax)
      })
    }
    return filtered
  }
)
