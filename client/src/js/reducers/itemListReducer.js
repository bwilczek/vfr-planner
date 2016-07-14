import axios from 'axios';

const initialState = {
  items: [],
};

export default function reducer(state=initialState, action) {
  switch (action.type) {
    case 'ITEM_LIST_ADD': {
      let newState = _.cloneDeep(state);
      newState.items.push(action.payload);
      newState.items.reverse();
      return newState;
      break;
    }
  }
  return state
}
