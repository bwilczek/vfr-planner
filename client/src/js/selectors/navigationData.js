import { createSelector } from 'reselect'
import { forEach } from 'lodash'

import * as navUtils from '../lib/NavigationUtils'
import * as format from '../lib/Formatter'

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
        let courseMag = course - wp.declination
        if (courseMag < 0) {
          courseMag += 360
        }
        segmentDistance = google.maps.geometry.spherical.computeLength([wpLatLng, nextLatLng])
        let nav = navUtils.computeWindTriange(flightPlan.tas, courseMag, segmentDistance, flightPlan.windSpeed, flightPlan.windDirection, flightPlan.speedUnit)
        totalDistance += segmentDistance
        totalDuration += nav.segmentDuration
        newWaypoint = {
          ...wp,
          course: format.heading(course),
          courseMag: format.heading(courseMag),
          segmentDistance: format.distance(segmentDistance, flightPlan.speedUnit),
          heading: format.heading(nav.heading),
          groundSpeed: format.speed(nav.groundSpeed, flightPlan.speedUnit),
          segmentDuration: format.duration(nav.segmentDuration),
          subTotalDuration: format.duration(totalDuration)
        }
      } else {
        newWaypoint = {
          ...wp,
          heading: null,
          segmentDistance: null,
          course: null,
          courseMag: null,
          groundSpeed: null,
          segmentDuration: null,
        }
      }

      waypoints.push(newWaypoint)
    })
    return { waypoints, totalDuration: format.duration(totalDuration), totalDistance: format.distance(totalDistance, flightPlan.speedUnit) }
  }
)
