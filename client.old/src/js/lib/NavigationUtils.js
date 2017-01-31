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

/*
function calculateForWind( bearing, distance ) {

  var air_speed = route_data.speed;

  var desired_course = degreesToRadians( bearing - route_data.declination );
  var wind_direction = degreesToRadians( ( route_data.wind_direction + 180 ) % 360 );

  if( wind_direction > Math.PI ) {
    wind_direction = wind_direction - 2 * Math.PI;
  }

  var fwt_angle = desired_course - wind_direction;
  if( fwt_angle > Math.PI ) {
    fwt_angle = fwt_angle - 2 * Math.PI;
  }
  if( fwt_angle < -Math.PI ) {
    fwt_angle = fwt_angle + 2 * Math.PI;
  }

  var fsinwca = route_data.wind_speed * Math.sin( fwt_angle ) / air_speed;
  var fwca = Math.asin( fsinwca );

  var heading = desired_course + fwca;
  while( heading > 2*Math.PI ) {
    heading = heading - 2*Math.PI;
  }
  while( heading < 0 ) {
    heading = heading + 2*Math.PI;
  }
  var ground_speed = air_speed * Math.cos( fwca ) + route_data.wind_speed * Math.cos( fwt_angle );

  ret.bearing = Math.round( radiansToDegrees( heading ) );
  ret.ground_speed = ground_speed;
  ret.time = calculateSegmentTimeForGroundSpeedKt( distance, ground_speed );
  return ret;
}

*/
