const initialState = {
  label: '',
  labels: [],
};

export function labelListReducer(state=initialState, action) {
  switch (action.type) {
    case 'LABEL_CHANGED': {
      return {...state, label: action.payload}
      break;
    }
    case 'LABEL_ADDED': {
      return {...state, labels: state.labels.concat(action.payload)}
      break;
    }
  }
  return state
}
