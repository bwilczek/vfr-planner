import { setGlobal } from 'reactn'
import axios from 'axios'

export function setLang(lang) {
  setGlobal(
    axios.post('/api/intl', {locale: lang})
      .then(response => ({translations: response.data.messages, locale: lang}))
      .catch(err => ({ error: err }))
  )
}
