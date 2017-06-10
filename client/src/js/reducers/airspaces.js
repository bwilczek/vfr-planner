import { filter, includes } from 'lodash'

const initialState = []

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'FETCH_AIRSPACES_PENDING': {
      return [...state]
    }
    case 'FETCH_AIRSPACES_REJECTED': {
      console.log("TODO: add error reducer and handle this message there")
      return [...state]
    }
    case 'FETCH_AIRSPACES_FULFILLED': {
      return action.payload.data
    }
    case 'CLEAR_AIRSPACES': {
      return []
    }
  }
  return state
}
