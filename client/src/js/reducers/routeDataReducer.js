import * as secrets from '../secrets'

const _ = require('lodash')
const GoogleMapsLoader = require('google-maps')
GoogleMapsLoader.KEY = secrets.GOOGLE_MAPS_KEY
GoogleMapsLoader.LIBRARIES = ['geometry']

const initialState = {
  waypoints: [],
  airSpeed: null,
  windSpeed: null,
  windDirection: null,
  totalDistance: 0,
  totalDuration: 0,
}

function setNavInfo(waypoints) {
  let totalDistance = 0
  GoogleMapsLoader.load((google) => {
    let segmentDistance = 0
    let next = null
    _.forEach(waypoints, (wp,i) => {
      segmentDistance = 0
      next = waypoints[i+1]
      if(next !== undefined) {
        let heading = google.maps.geometry.spherical.computeHeading(wp.latLng, next.latLng)
        if (heading<0) {
          heading += 360
        }
        segmentDistance = google.maps.geometry.spherical.computeLength([wp.latLng, next.latLng])
        waypoints[i] = {
          ...wp,
          heading,
          distance: segmentDistance,
          // TODO: calculate GS and segment time
        }
        totalDistance += segmentDistance
      } else {
        waypoints[i] = {
          ...wp,
          heading: null,
          distance: null,
        }
      }
    })
  })
  return { totalDistance }
}

export default function reducer(state=initialState, action) {
  switch (action.type) {
    case 'WAYPOINT_ADDED': {
      let newState = _.cloneDeep(state)
      let summary = null
      if(action.payload.position == null) {
        newState.waypoints.push(action.payload.waypoint)
      } else {
        newState.waypoints.splice(action.payload.position, 0, action.payload.waypoint)
      }
      summary = setNavInfo(newState.waypoints)
      newState.totalDistance = summary.totalDistance
      return newState
      break
    }
    case 'WAYPOINT_REORDER': {
      let newState = _.cloneDeep(state)
      let summary = null
      newState.waypoints = action.payload
      summary = setNavInfo(newState.waypoints)
      newState.totalDistance = summary.totalDistance
      return newState
      break
    }
    case 'WAYPOINT_UPDATE': {
      let waypointToUpdate = action.payload
      let newState = _.cloneDeep(state)
      let summary = null
      let i = _.findIndex(newState.waypoints, ['key', waypointToUpdate.key])
      newState.waypoints[i] = waypointToUpdate
      summary = setNavInfo(newState.waypoints)
      newState.totalDistance = summary.totalDistance
      return newState
      break
    }
    case 'WAYPOINT_DELETE': {
      let newState = _.cloneDeep(state)
      let summary = null
      _.remove(newState.waypoints, (wp) => {
        return wp.key == action.payload.key
      })
      summary = setNavInfo(newState.waypoints)
      newState.totalDistance = summary.totalDistance
      return newState
      break
    }
    case 'WAYPOINT_REVERSE_GEOCODE_PENDING': {
      //do nothing
      //return _.cloneDeep(state);
      break
    }
    case 'WAYPOINT_REVERSE_GEOCODE_REJECTED': {
      // ignore the error
      let newState = _.cloneDeep(state)
      newState.runGeocode = null
      return newState
      break
    }
    case 'WAYPOINT_REVERSE_GEOCODE_FULFILLED': {
      let newState = _.cloneDeep(state)
      // action.payload.data contains { key: 123, name: 'EPWS', details: {radio: 122.8, icao_code: epws, type: asd} }
      let i = _.findIndex(newState.waypoints, ['key', action.payload.data.key])
      newState.waypoints[i].name = action.payload.data.name
      newState.runGeocode = null
      return newState
      break
    }
  }
  return state
}
