import axios from 'axios'

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

export function fetchAirspaces(countries) {
  return {
    type: 'FETCH_AIRSPACES',
    payload: axios.get('/api/airspaces', { params: {countries} })
  }
}

export function clearAirspaces() {
  return {
    type: 'CLEAR_AIRSPACES',
    payload: null
  }
}
