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
    case 'WAYPOINT_REORDER': {
      let newState = _.cloneDeep(state);
      newState.waypoints = action.payload;
      return newState;
      break;
    }
    case 'WAYPOINT_UPDATE': {
      let waypointToUpdate = action.payload;
      let newState = _.cloneDeep(state);
      let i = _.findIndex(newState.waypoints, ['key', waypointToUpdate.key]);
      newState.waypoints[i] = waypointToUpdate;
      return newState;
      break;
    }
    case 'WAYPOINT_REVERSE_GEOCODE_PENDING': {
      console.log('WAYPOINT_REVERSE_GEOCODE_PENDING');
      //return _.cloneDeep(state);
      break;
    }
    case 'WAYPOINT_REVERSE_GEOCODE_REJECTED': {
      console.log('WAYPOINT_REVERSE_GEOCODE_REJECTED');
      //return {...state, error: action.payload}
      break;
    }
    case 'WAYPOINT_REVERSE_GEOCODE_FULFILLED': {
      console.log('WAYPOINT_REVERSE_GEOCODE_FULFILLED');
      //let data = action.payload.data;
      //return {
      //  ...state,
      //  items: action.payload.data,
      //}
      break;
    }
  }
  return state
}
