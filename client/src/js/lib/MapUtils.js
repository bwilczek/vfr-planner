import { forEach } from 'lodash'

import iconNavPointUncontrolled from '../../img/aerodrome.png'
import iconNavPointVfrPoint from '../../img/vfr_point.png'
import iconNavPointControlled from '../../img/airport.png'
import iconNavPointMilitary from '../../img/aerodrome_mil.png'
import iconNavPointAirstrip from '../../img/airfield.png'
import iconNavPointHelipad from '../../img/airfield_h.png'
import iconNavPointVor from '../../img/vor.png'
import iconNavPointNdb from '../../img/ndb.png'
import iconNavPointVorDme from '../../img/dvor_dme.png'
import iconNavPointDme from '../../img/dme.png'
import iconNavPointOtherAirstrip from '../../img/airfield_other.png'
import iconNavPointIfrPoint from '../../img/ifr_point.png'
import iconWayPoint from '../../img/waypoint_basic.svg'
import iconWayPointMouseOver from '../../img/waypoint_basic_hover.svg'
import iconPotentialWayPoint from '../../img/waypoint_potential.svg'

export function extractPointsFromAirspace(airspace) {
  let ret = []
  forEach(airspace.points.split(' '), (point) => {
    let tmp = point.split(',')
    let lat = parseFloat(tmp[1])
    let lng = parseFloat(tmp[0])
    ret.push({lat, lng})
  })
  return ret
}

export function createAirspaceRawPolygon(airspace) {
  let color
  switch (airspace.kind) {
    case 'atz':
      color = '#8811CC'
      break
    case 'ctr':
    case 'tma':
      color = '#0000DD'
      break
    case 'mctr':
    case 'matz':
    case 'tfr':
    case 'mrt':
      color = '#114411'
      break
    case 'prohibited':
    case 'restricted':
    case 'danger':
    case 'tra':
    case 'tsa':
      color = '#BB0066'
      break
    default:
      color = '#CCCCCC'
  }

  let polygon = L.polygon(extractPointsFromAirspace(airspace), {color: color, opacity: 0.75, weight: 2, fillColor: color, fillOpacity: 0.28})
  polygon.airspace = airspace
  return polygon
}

export function getIconForNavPointKind(kind) {
  switch (kind) {
    case 'vfr_point':
      return iconNavPointVfrPoint
    case 'uncontrolled':
      return iconNavPointUncontrolled
    case 'controlled':
      return iconNavPointControlled
    case 'military':
      return iconNavPointMilitary
    case 'airstrip':
      return iconNavPointAirstrip
    case 'helipad':
      return iconNavPointHelipad
    case 'vor':
      return iconNavPointVor
    case 'ndb':
      return iconNavPointNdb
    case 'vor_dme':
      return iconNavPointVorDme
    case 'dme':
      return iconNavPointDme
    case 'other_airstrip':
      return iconNavPointOtherAirstrip
    case 'ifr_point':
      return iconNavPointIfrPoint
  }
}

export function getIconForWaypoint() {
  return iconWayPoint
}

export function getIconForWaypointMouseOver() {
  return iconWayPointMouseOver
}

export function getIconForPotentialWaypoint() {
    return iconPotentialWayPoint
}
