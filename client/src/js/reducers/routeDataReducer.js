const initialState = {
  waypoints: [],
  weather: {},
};

export default function reducer(state=initialState, action) {
  switch (action.type) {
    case 'WAYPOINT_ADDED': {
      let newState = _.cloneDeep(state);
      if(action.payload.position == null) {
        newState.waypoints.push(action.payload.waypoint);
      } else {
        newState.waypoints.splice(action.payload.position, 0, action.payload.waypoint);
      }
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
      //do nothing
      //return _.cloneDeep(state);
      break;
    }
    case 'WAYPOINT_REVERSE_GEOCODE_REJECTED': {
      // ignore the error
      let newState = _.cloneDeep(state);
      newState.runGeocode = null;
      return newState;
      break;
    }
    case 'WAYPOINT_REVERSE_GEOCODE_FULFILLED': {
      let newState = _.cloneDeep(state);
      // action.payload.data contains { key: 123, name: 'EPWS', details: {radio: 122.8, icao_code: epws, type: asd} }
      let i = _.findIndex(newState.waypoints, ['key', action.payload.data.key]);
      newState.waypoints[i].name = action.payload.data.name;
      newState.runGeocode = null;
      return newState;
      break;
    }
  }
  return state
}
