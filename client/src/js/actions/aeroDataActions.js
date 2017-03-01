import axios from 'axios'

export function fetchNavPoints(countries, types) {
  return {
    type: 'FETCH_NAV_POINTS',
    payload: axios.get('/api/nav_points', {countries, types})
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
