import { setGlobal, getGlobal } from 'reactn'
import axios from 'axios'

export function setLang(lang = null) {
  if(lang == null) {
    lang = getGlobal().defaultLocale
  }
  setGlobal(
    axios.post('/api/intl', {locale: lang})
      .then(response => ({translations: response.data.messages, locale: lang}))
      .catch(err => ({ error: err }))
  )
}
