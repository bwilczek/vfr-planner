import { filter, includes, uniqBy } from 'lodash'

const initialState = []

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'FETCH_NAV_POINTS_PENDING': {
      return [...state]
    }
    case 'FETCH_NAV_POINTS_REJECTED': {
      console.log('TODO: add error reducer and handle this message there (toastr?)')
      return [...state]
    }
    case 'FETCH_NAV_POINTS_FULFILLED': {
      return uniqBy([...state, ...action.payload.data], 'id')
    }
    case 'CLEAR_NAV_POINTS_BY_KIND': {
      return filter(state, (navPoint) => { return !includes(action.payload, navPoint.kind) })
    }
    case 'CLEAR_NAV_POINTS': {
      return []
    }
  }
  return state
}
