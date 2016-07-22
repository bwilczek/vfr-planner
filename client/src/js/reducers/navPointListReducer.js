const _ = require('lodash')

const initialState = {
  items: [],
  error: null,
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'NAV_POINTS_FETCH_PENDING': {
      return _.cloneDeep(state)
    }
    case 'NAV_POINTS_FETCH_REJECTED': {
      return {...state, error: action.payload}
    }
    case 'NAV_POINTS_FETCH_FULFILLED': {
      return {
        ...state,
        items: action.payload.data,
      }
    }
  }
  return state
}
