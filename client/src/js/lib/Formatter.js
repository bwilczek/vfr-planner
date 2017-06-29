import { round } from 'lodash'
import moment from 'moment'

export function distance(meters) {
  return round(meters / 1852, 1) + 'NM'
}

export function speed(speed) {
  return round(speed, 1) + 'kt'
}

export function duration(secs) {
  if (secs > 3600) {
    return moment().startOf('day').seconds(secs).format('H[<sup>h</sup>]m\'ss"')
  } else {
    return moment().startOf('day').seconds(secs).format('m\'ss"')
  }
}

export function heading(degrees) {
  return Math.round(degrees) + '°'
}
