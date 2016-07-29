import * as secrets from '../secrets'
import * as navUtils from '../lib/NavigationUtils'

const _ = require('lodash')
const GoogleMapsLoader = require('google-maps')
GoogleMapsLoader.KEY = secrets.GOOGLE_MAPS_KEY
GoogleMapsLoader.LIBRARIES = ['geometry']

const initialState = {
  waypoints: [],
  airSpeed: 70,
  windSpeed: 0,
  windDirection: 0,
  levelMin: 1200,
  levelMax: 1500,
  flightStartTime: 800,
  flightEndTime: 1200,
  totalDistance: 0,
  totalDuration: 0,
  declination: 0,
}

function computeNavData(newState) {
  newState.totalDistance = 0
  newState.totalDuration = 0
  GoogleMapsLoader.load((google) => {
    let segmentDistance = 0
    let next = null
    _.forEach(newState.waypoints, (wp,i) => {
      segmentDistance = 0
      next = newState.waypoints[i+1]
      if(next !== undefined) {
        let course = google.maps.geometry.spherical.computeHeading(wp.latLng, next.latLng)
        if (course<0) {
          course += 360
        }
        segmentDistance = google.maps.geometry.spherical.computeLength([wp.latLng, next.latLng])
        let nav = navUtils.computeWindTriange(newState.airSpeed, course, segmentDistance, newState.windSpeed, newState.windDirection, newState.declination)
        newState.waypoints[i] = {
          ...wp,
          course,
          segmentDistance,
          ...nav,
        }
        newState.totalDistance += segmentDistance
        newState.totalDuration += nav.segmentDuration
      } else {
        newState.waypoints[i] = {
          ...wp,
          heading: null,
          segmentDistance: null,
          course: null,
          groundSpeed: null,
          segmentDuration: null,
        }
      }
    })
  })
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
      computeNavData(newState)
      return newState
      break
    }
    case 'WAYPOINT_REORDER': {
      let newState = _.cloneDeep(state)
      let summary = null
      newState.waypoints = action.payload
      computeNavData(newState)
      return newState
      break
    }
    case 'WAYPOINT_UPDATE': {
      let waypointToUpdate = action.payload
      let newState = _.cloneDeep(state)
      let summary = null
      let i = _.findIndex(newState.waypoints, ['key', waypointToUpdate.key])
      newState.waypoints[i] = waypointToUpdate
      computeNavData(newState)
      return newState
      break
    }
    case 'WAYPOINT_DELETE': {
      let newState = _.cloneDeep(state)
      let summary = null
      _.remove(newState.waypoints, (wp) => {
        return wp.key == action.payload.key
      })
      computeNavData(newState)
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
    case 'FLIGHT_SETTINGS_UPDATE': {
      let newState = _.cloneDeep(state)
      newState = { ...newState, ...action.payload }
      computeNavData(newState)
      return newState
      break
    }
  }
  return state
}
