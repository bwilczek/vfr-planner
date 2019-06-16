import { getGlobal, setGlobal } from 'reactn'
import axios from 'axios'

export function setNavPoints() {
  let countries = getGlobal().ui.countries
  let kinds = getGlobal().ui.nav_points
  setGlobal(
    axios.get('/api/nav_points', { params: {countries, kinds } })
      .then(response => ({nav_points: response.data}))
      .catch(err => ({ error: err }))
  )
}
