import { createSelector } from 'reselect'

const flightPlanSelector = state => state.flightPlan

export const getNavigationData = createSelector(
  flightPlanSelector,
  (flightPlan) => {
    // TODO: read flightPlan.windDirection, flightPlan.windSpeed, flightPlan.tas and calculate bearings durations, etc
    return flightPlan.waypoints
  }
)

/*

const GoogleMapsLoader = require('google-maps')
GoogleMapsLoader.KEY = secrets.GOOGLE_MAPS_KEY
GoogleMapsLoader.LIBRARIES = ['geometry']

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
*/
