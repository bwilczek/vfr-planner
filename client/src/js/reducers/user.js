import axios from 'axios'

const initialState = {
  name: '',
  id: null,
  error: null,
  token: null,
  flightPlans: null
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'AUTHENTICATE_PENDING': {
      return {...state}
    }
    case 'AUTHENTICATE_REJECTED': {
      return {...state, error: action.payload}
    }
    case 'AUTHENTICATE_FULFILLED': {
      let data = action.payload.data
      axios.defaults.headers.common['Authorization'] = data.token
      return {
        ...state,
        name: data.name,
        id: data.id,
        token: data.token,
        img: data.img,
      }
    }
    // IGNORE
    // case 'FETCH_FLIGHT_PLANS_PENDING': {}
    // case 'FETCH_FLIGHT_PLANS_REJECTED': {}
    case 'FETCH_FLIGHT_PLANS_FULFILLED': {
      return {
        ...state,
        flightPlans: action.payload.data,
      }
    }
  }
  return state
}
