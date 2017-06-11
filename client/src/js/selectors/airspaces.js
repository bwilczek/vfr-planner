import { createSelector } from 'reselect'

const airspacesSelector = state => state.airspaces
const uiSelector = state => state.ui

export const getAirspacesForFilters = createSelector(
  airspacesSelector,
  uiSelector,
  (airspaces, ui) => {
    // TODO:  filter by ui.levels[0] / ui.levels[1] / ui.hours[0] / ui.hours[1]
    return airspaces
  }
)
