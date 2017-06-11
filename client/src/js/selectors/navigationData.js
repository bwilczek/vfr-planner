import { createSelector } from 'reselect'
import { forEach } from 'lodash'

import * as navUtils from '../lib/NavigationUtils'

const flightPlanSelector = state => state.flightPlan

export const getNavigationData = createSelector(
  flightPlanSelector,
  (flightPlan) => {
    let waypoints = []
    let segmentDistance = 0
    let totalDistance = 0
    let totalDuration = 0
    forEach(flightPlan.waypoints, (wp, i) => {
      let next = null
      let newWaypoint = null
      segmentDistance = 0
      next = flightPlan.waypoints[i + 1]

      if (next !== undefined) {
        let wpLatLng = navUtils.standardizeLatLng(wp.latLng)
        let nextLatLng = navUtils.standardizeLatLng(next.latLng)
        let course = google.maps.geometry.spherical.computeHeading(wpLatLng, nextLatLng)
        if (course < 0) {
          course += 360
        }
        segmentDistance = google.maps.geometry.spherical.computeLength([wpLatLng, nextLatLng])
        let nav = navUtils.computeWindTriange(flightPlan.tas, course, segmentDistance, flightPlan.windSpeed, flightPlan.windDirection, wp.declination)
        newWaypoint = {
          ...wp,
          course,
          segmentDistance,
          ...nav,
        }
        totalDistance += segmentDistance
        totalDuration += nav.segmentDuration
      } else {
        newWaypoint = {
          ...wp,
          heading: null,
          segmentDistance: null,
          course: null,
          groundSpeed: null,
          segmentDuration: null,
        }
      }

      waypoints.push(newWaypoint)
    })
    return { waypoints, totalDuration, totalDistance }
  }
)
