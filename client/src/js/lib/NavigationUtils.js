export function computeWindTriange(airSpeed, courseMag, distance, windSpeed, windDirection, speedUnit) {
  // convert speed to kt if necessary
  if (speedUnit === 'km/h') {
    airSpeed = airSpeed * 0.5399568
  }
  let degreesToRadians = (deg) => deg * (Math.PI / 180)
  let radiansToDegrees = (rad) => rad / (Math.PI / 180)

  const courseRadians = degreesToRadians(courseMag)
  let windDirectionRadians = degreesToRadians((windDirection + 180) % 360)

  if (windDirectionRadians > Math.PI) {
    windDirectionRadians = windDirectionRadians - 2 * Math.PI
  }

  let fwtAngle = courseRadians - windDirectionRadians
  if (fwtAngle > Math.PI) {
    fwtAngle = fwtAngle - 2 * Math.PI
  }
  if (fwtAngle < -Math.PI) {
    fwtAngle = fwtAngle + 2 * Math.PI
  }

  let fsinwca = windSpeed * Math.sin(fwtAngle) / airSpeed
  let fwca = Math.asin(fsinwca)

  let headingRadians = courseRadians + fwca
  while (headingRadians > 2 * Math.PI) {
    headingRadians = headingRadians - 2 * Math.PI
  }
  while (headingRadians < 0) {
    headingRadians = headingRadians + 2 * Math.PI
  }
  let groundSpeed = airSpeed * Math.cos(fwca) + windSpeed * Math.cos(fwtAngle)

  let heading = radiansToDegrees(headingRadians)
  let segmentDuration = distance / (groundSpeed * 30.866666667 / 60)
  let rawGroundSpeed = groundSpeed
  // convert groundSpeed to km/h for display if necessary
  if (speedUnit === 'km/h') {
    groundSpeed = groundSpeed * 1.8520
  }
  return { heading, groundSpeed, segmentDuration, rawGroundSpeed }
}

export function sanitizeDegrees(degrees) {
  if (degrees < 0) {
    return degrees + 360
  }
  if (degrees > 360) {
    return degrees - 360
  }
  return degrees
}
