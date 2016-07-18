const initialState = {
  waypoints: [],
  weather: {},
};

export default function reducer(state=initialState, action) {
  switch (action.type) {
    case 'WAYPOINT_ADDED': {
      let newState = _.cloneDeep(state);
      newState.waypoints.push(action.payload);
      return newState;
      break;
    }
  }
  return state
}
