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
    axios({
      method: 'post',
      url: '/api/downloads/pdf',
      data: params,
      responseType: 'blob'
    }).then(
      (response) => {
        dispatch(toastrActions.remove('pleaseWait'))
        fileDownload(response.data, 'plan.pdf', 'application/pdf')
      },
      (error) => {
        console.log(error)
        dispatch(toastrActions.remove('pleaseWait'))
        dispatch(toastrActions.add(ToastrUtils.configForError('errorMessageNetwork')))
      }
    )
  }
}

export function fetchKml(params) {
  return (dispatch) => {
    dispatch(toastrActions.add(ToastrUtils.configForPleaseWait()))
    axios.post('/api/downloads/kml', params).then(
      (response) => {
        dispatch(toastrActions.remove('pleaseWait'))
        fileDownload(response.data, 'plan.kml', 'application/vnd.google-earth.kml+xml')
      },
      (error) => {
        console.log(error)
        dispatch(toastrActions.remove('pleaseWait'))
        dispatch(toastrActions.add(ToastrUtils.configForError('errorMessageNetwork')))
      }
    )
  }
}
