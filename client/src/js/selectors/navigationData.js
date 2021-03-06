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
        let wpLatLng = wp.latLng
        let nextLatLng = next.latLng

        // let course = google.maps.geometry.spherical.computeHeading(wpLatLng, nextLatLng)
        let course = L.GeometryUtil.bearing(wpLatLng, nextLatLng)

        course = navUtils.sanitizeDegrees(course)
        let courseMag = course - wp.declination
        courseMag = navUtils.sanitizeDegrees(courseMag)
        // segmentDistance = google.maps.geometry.spherical.computeLength([wpLatLng, nextLatLng])
        segmentDistance = L.GeometryUtil.length(L.polyline([wpLatLng, nextLatLng]))

        let nav = navUtils.computeWindTriange(flightPlan.tas, courseMag, segmentDistance, flightPlan.windSpeed, flightPlan.windDirection, flightPlan.speedUnit)
        totalDistance += segmentDistance
        totalDuration += nav.segmentDuration
        newWaypoint = {
          ...wp,
          course: format.heading(course),
          rawCourse: course,
          courseMag: format.heading(courseMag),
          rawCourseMag: courseMag,
          segmentDistance: format.distance(segmentDistance, flightPlan.speedUnit),
          heading: format.heading(nav.heading),
          rawHeading: nav.heading,
          groundSpeed: format.speed(nav.groundSpeed, flightPlan.speedUnit),
          rawGroundSpeed: nav.rawGroundSpeed,
          segmentDuration: format.duration(nav.segmentDuration),
          rawSegmentDuration: nav.segmentDuration,
          subTotalDuration: format.duration(totalDuration)
        }
      } else {
        newWaypoint = {
          ...wp,
          heading: null,
          rawHeading: null,
          segmentDistance: null,
          course: null,
          rawCourse: null,
          courseMag: null,
          groundSpeed: null,
          rawGroundSpeed: null,
          segmentDuration: null,
          rawSegmentDuration: null
        }
      }

      waypoints.push(newWaypoint)
    })
    return { waypoints, totalDuration: format.duration(totalDuration), totalDistance: format.distance(totalDistance, flightPlan.speedUnit) }
  }
)
