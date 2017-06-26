import axios from 'axios'
import { actions as toastrActions } from 'react-redux-toastr'

import ToastrUtils from '../lib/ToastrUtils'

export function fetchNavPoints(countries, kinds) {
  return {
    type: 'FETCH_NAV_POINTS',
    payload: axios.get('/api/nav_points', { params: {countries, kinds} })
  }
}

export function clearNavPoints() {
  return {
    type: 'CLEAR_NAV_POINTS',
    payload: null
  }
}

export function clearNavPointsByKind(kinds) {
  return {
    type: 'CLEAR_NAV_POINTS_BY_KIND',
    payload: kinds
  }
}

export function updateAirspaces(data) {
  return {
    type: 'UPDATE_AIRSPACES',
    payload: data
  }
}

export function fetchAirspaces(countries, mode, levels, hours) {
  return (dispatch) => {
    dispatch(toastrActions.add(ToastrUtils.configForPleaseWait()))
    axios.get('/api/airspaces', { params: {countries, mode, levels, hours} }).then(
      (response) => {
        dispatch(toastrActions.remove('pleaseWait'))
        if (response.data.length === 0) {
          dispatch(toastrActions.add('configForNoAreasFound'))
        }
        dispatch(updateAirspaces(response.data))
      },
      (error) => {
        dispatch(toastrActions.remove('pleaseWait'))
        dispatch(toastrActions.add(ToastrUtils.configForError('errorMessageNetwork')))
      }
    )
  }
}

export function clearAirspaces() {
  return {
    type: 'CLEAR_AIRSPACES',
    payload: null
  }
}
