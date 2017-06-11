import { createSelector } from 'reselect'
import { filter } from 'lodash'

const airspacesSelector = state => state.airspaces
const uiSelector = state => state.ui

export const getAirspacesForFilters = createSelector(
  airspacesSelector,
  uiSelector,
  (airspaces, ui) => {
    // TODO:  filter by ui.levels[0] / ui.levels[1] / ui.hours[0] / ui.hours[1]
    return filter(airspaces, (airspace) => {
      return ( airspace.level_min >= ui.levels[0] && airspace.level_min <= ui.levels[1] )
        || ( airspace.level_max >= ui.levels[0] && airspace.level_max <= ui.levels[1] )
    })
  }
)
