import axios from 'axios'
import fileDownload from 'react-file-download'
import { actions as toastrActions } from 'react-redux-toastr'

import ToastrUtils from '../lib/ToastrUtils'

export function updatePrintSettings(fields) {
  return {
    type: 'UPDATE_PRINT_SETTINGS',
    payload: fields
  }
}

export function fetchPdf(params) {
  return (dispatch) => {
    dispatch(toastrActions.add(ToastrUtils.configForPleaseWait()))
    axios.get('/api/downloads/pdf', {responseType: 'blob', params}).then(
      (response) => {
        console.log(response)
        dispatch(toastrActions.remove('pleaseWait'))
        fileDownload(response.data, 'plan.pdf', 'application/pdf')
      },
      (error) => {
        dispatch(toastrActions.remove('pleaseWait'))
        dispatch(toastrActions.add(ToastrUtils.configForError('errorMessageNetwork')))
      }
    )
  }
}
