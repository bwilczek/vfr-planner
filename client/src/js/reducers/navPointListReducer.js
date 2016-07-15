import axios from 'axios';

const initialState = {
  items: [],
  error: null,
};

export default function reducer(state=initialState, action) {
  switch (action.type) {
    case 'NAV_POINTS_FETCH_PENDING': {
      return _.cloneDeep(state);
      break;
    }
    case 'NAV_POINTS_FETCH_REJECTED': {
      return {...state, error: action.payload}
      break;
    }
    case 'NAV_POINTS_FETCH_FULFILLED': {
      let data = action.payload.data;
      return {
        ...state,
        items: action.payload.data,
      }
      break;
    }
  }
  return state
}
