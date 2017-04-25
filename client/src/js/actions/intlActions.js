import axios from 'axios'
import { updateIntl } from 'react-intl-redux'

export function fetchIntl(locale) {
  return (dispatch) => {
    axios.post('/api/intl', {locale}).then(
      (response) => {
        dispatch(updateIntl(response.data))
      },
      (error) => {
        dispatch({type: 'XHR_REQUEST_FAILED'})
      }
    )
  }
}
