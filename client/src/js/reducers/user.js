const initialState = {
  name: '',
  id: null,
  token: null,
  img: null,
  flightPlans: null
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_USER': {
      return {...state, ...action.payload}
    }
    // IGNORE FOR NOW
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
