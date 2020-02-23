import axios from 'axios'
import { actions as toastrActions } from 'react-redux-toastr'

import ToastrUtils from '../lib/ToastrUtils'

export function updateUser(data) {
  return {
    type: 'UPDATE_USER',
    payload: data
  }
}

export function logout() {
  return (dispatch) => {
    dispatch(toastrActions.add(ToastrUtils.configForPleaseWait()))
    axios.delete('/api/sessions/666').then(
      (response) => {
        const data = {
          name: '',
          id: null,
          token: null,
          img: null,
          flightPlans: null
        }
        axios.defaults.headers.common['Authorization'] = null
        dispatch(toastrActions.remove('pleaseWait'))
        dispatch(updateUser(data))
      },
      (error) => {
        dispatch(toastrActions.remove('pleaseWait'))
        let errorMessageKey = error.response.status === 401 ? 'errorMessageUnauthorized' : 'errorMessageNetwork'
        dispatch(toastrActions.add(ToastrUtils.configForError(errorMessageKey)))
      }
    )
  }
}

export function authenticate(provider, token) {
  return (dispatch) => {
    dispatch(toastrActions.add(ToastrUtils.configForPleaseWait()))
    axios.post('/api/sessions', {provider, token}).then(
      (response) => {
        const data = {
          name: response.data.name,
          id: response.data.id,
          token: response.data.token,
          img: response.data.img,
        }
        axios.defaults.headers.common['Authorization'] = data.token
        dispatch(toastrActions.remove('pleaseWait'))
        dispatch(updateUser(data))
      },
      (error) => {
        dispatch(toastrActions.remove('pleaseWait'))
        let errorMessageKey = error.response.status === 401 ? 'errorMessageUnauthorized' : 'errorMessageNetwork'
        dispatch(toastrActions.add(ToastrUtils.configForError(errorMessageKey)))
      }
    )
  }
}
