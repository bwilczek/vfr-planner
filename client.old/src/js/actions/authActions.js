import axios from 'axios'

export function authenticate(provider, token) {
  return {
    type: 'AUTHENTICATE',
    payload: axios.post('/api/sessions', {provider, token}),
  }
}
