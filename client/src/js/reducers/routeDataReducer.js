import * as secrets from '../secrets';

const GoogleMapsLoader = require('google-maps');
GoogleMapsLoader.KEY = secrets.GOOGLE_MAPS_KEY;
GoogleMapsLoader.LIBRARIES = ['geometry'];

const initialState = {
  waypoints: [],
  weather: {},
};

function setNavInfo(waypoints) {
  GoogleMapsLoader.load((google) => {
    _.forEach(waypoints, (wp,i) => {
      let next = waypoints[i+1]
      if(next !== undefined) {
        console.log('calculate heading')
        let heading = google.maps.geometry.spherical.computeHeading(wp.latLng, next.latLng)
        if (heading<0) {
          heading += 360
        }
        waypoints[i] = {
          ...wp,
          heading,
          distance: google.maps.geometry.spherical.computeLength([wp.latLng, next.latLng]),
        }
      } else {
        waypoints[i] = {
          ...wp,
          heading: null,
          distance: null,
        }
      }
    })
  })
  // return waypoints;
}

export default function reducer(state=initialState, action) {
  switch (action.type) {
    case 'WAYPOINT_ADDED': {
      let newState = _.cloneDeep(state);
      if(action.payload.position == null) {
        newState.waypoints.push(action.payload.waypoint);
      } else {
        newState.waypoints.splice(action.payload.position, 0, action.payload.waypoint);
      }
      setNavInfo(newState.waypoints)
      return newState;
      break;
    }
    case 'WAYPOINT_REORDER': {
      let newState = _.cloneDeep(state);
      newState.waypoints = action.payload;
      setNavInfo(newState.waypoints)
      return newState;
      break;
    }
    case 'WAYPOINT_UPDATE': {
      let waypointToUpdate = action.payload;
      let newState = _.cloneDeep(state);
      let i = _.findIndex(newState.waypoints, ['key', waypointToUpdate.key]);
      newState.waypoints[i] = waypointToUpdate;
      setNavInfo(newState.waypoints)
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
