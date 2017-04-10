export function computeWindTriange(airSpeed, course, distance, windSpeed, windDirection, declination ) {
  // return { groundSpeed, heading, duration }

  let degreesToRadians = (deg) => deg * (Math.PI / 180)
  let radiansToDegrees = (rad) => rad / (Math.PI / 180)

  const courseRadians = degreesToRadians( course - declination )
  let windDirectionRadians = degreesToRadians( ( windDirection + 180 ) % 360 )

  if( windDirectionRadians > Math.PI ) {
    windDirectionRadians = windDirectionRadians - 2 * Math.PI
  }

  let fwt_angle = courseRadians - windDirectionRadians
  if( fwt_angle > Math.PI ) {
    fwt_angle = fwt_angle - 2 * Math.PI
  }
  if( fwt_angle < -Math.PI ) {
    fwt_angle = fwt_angle + 2 * Math.PI;
  }

  let fsinwca = windSpeed * Math.sin( fwt_angle ) / airSpeed
  let fwca = Math.asin( fsinwca )

  let headingRadians = courseRadians + fwca;
  while( headingRadians > 2*Math.PI ) {
    headingRadians = heading - 2*Math.PI;
  }
  while( headingRadians < 0 ) {
    headingRadians = headingRadians + 2*Math.PI;
  }
  let groundSpeed = airSpeed * Math.cos( fwca ) + windSpeed * Math.cos( fwt_angle )

  let heading = radiansToDegrees( headingRadians )
  // windSpeed in kt, distance in meters
  let segmentDuration = distance / ( groundSpeed * 30.866666667 / 60 )
  return { heading, groundSpeed, segmentDuration }
}

export function standardizeLatLng(o) {
  if(typeof(o.lat) == 'function') {
    return o
  } else {
    return new google.maps.LatLng(o.lat, o.lng)
  }
}
