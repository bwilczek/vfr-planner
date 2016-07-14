import axios from "axios";

export function authenticate(provider, token) {
  return {
    type: 'AUTHENTICATE',
    payload: axios.post("/authenticate", {provider, token}),
  }
}
