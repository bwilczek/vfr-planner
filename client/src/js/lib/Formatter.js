import { round } from 'lodash'
import { sprintf } from 'sprintf-js'
import moment from 'moment'

export function distance(meters, speedUnit) {
  if (speedUnit === 'kt') {
    return round(meters / 1852, 1) + 'NM'
  } else {
    return round(meters / 1000, 1) + 'km'
  }
}

export function speed(speed, speedUnit = 'kt', precision = 1) {
  return round(speed, precision) + speedUnit
}

export function duration(secs) {
  if (secs > 3600) {
    return moment().startOf('day').seconds(secs).format('H[<sup>h</sup>]m\'ss"')
  } else {
    return moment().startOf('day').seconds(secs).format('m\'ss"')
  }
}

export function hour(raw) {
  raw = parseInt(raw)
  let h = parseInt(raw / 100)
  let m = parseInt(raw % 100)
  return sprintf('%02d:%02d', h, m)
}

export function heading(degrees) {
  return Math.round(degrees) + '°'
}

export function coords(location) {
  let o = {}
  let secs

  let lat = location.lat
  o.latDeg = parseInt(lat)
  secs = parseInt((lat - o.latDeg) * 3600)
  o.latMin = Math.abs(parseInt(secs / 60))
  o.latSec = Math.abs(parseInt(secs % 60))
  o.latDir = (o.latDeg > 0) ? 'N' : 'S'
  o.latDeg = Math.abs(o.latDeg)

  let lng = location.lng
  o.lngDeg = parseInt(lng)
  secs = parseInt((lng - o.lngDeg) * 3600)
  o.lngMin = Math.abs(parseInt(secs / 60))
  o.lngSec = Math.abs(parseInt(secs % 60))
  o.lngDir = (o.lngDeg > 0) ? 'E' : 'W'
  o.lngDeg = Math.abs(o.lngDeg)

  return sprintf('%02d', parseInt(o.latDeg)) + '°' +
    sprintf('%02d', parseInt(o.latMin)) + "'" +
    sprintf('%02d', parseInt(o.latSec)) + '"' +
    o.latDir + ' ' +
    sprintf('%03d', parseInt(o.lngDeg)) + '°' +
    sprintf('%02d', parseInt(o.lngMin)) + "'" +
    sprintf('%02d', parseInt(o.lngSec)) + '"' +
    o.lngDir
}


export function linkify(text) {
  const urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
  return text.replace(urlRegex, function(url) {
      return '<a href="' + url + '" target="_blank">' + url + '</a>';
  })
}
