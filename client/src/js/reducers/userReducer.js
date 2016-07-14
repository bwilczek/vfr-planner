import axios from 'axios';

const initialState = {
  name: '',
  id: null,
  error: null,
  token: null,
};

export default function reducer(state=initialState, action) {
  switch (action.type) {
    case "AUTHENTICATE_PENDING": {
      return _.cloneDeep(state);
      break;
    }
    case "AUTHENTICATE_REJECTED": {
      return {...state, error: action.payload}
      break;
    }
    case "AUTHENTICATE_FULFILLED": {
      let data = action.payload.data;
      axios.defaults.headers.common['Authorization'] = data.token;
      return {
        ...state,
        name: data.name,
        id: data.id,
        token: data.token,
      }
      break;
    }
  }
  return state
}
