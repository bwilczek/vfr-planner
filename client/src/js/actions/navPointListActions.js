import axios from 'axios'

export function fetchAll() {
  return {
    type: 'NAV_POINTS_FETCH',
    payload: axios.get('/nav_points'),
  }
}
