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
      // filter by ui.hours[0]*100 / ui.hours[1]*100
      const hours_min = ui.hours[0] * 100
      const hours_max = ui.hours[1] * 100
      filtered = filter(filtered, (airspace) => {
        return (airspace.time_from >= hours_min && airspace.time_from <= hours_max) ||
          (airspace.time_to >= hours_min && airspace.time_to <= hours_max) ||
          (airspace.time_from <= hours_min && airspace.time_to >= hours_max)
      })
    }
    return filtered
  }
)
