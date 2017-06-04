NavPoint.destroy_all

NavPoint.create(
  name: 'Wrocław-Szymanów',
  icao_code: 'EPWS',
  lat: 51.207056,
  lng: 16.998306,
  country: 'pl',
  radio: '122.8',
  status: :active,
  kind: :uncontrolled,
  declination: 4,
)

NavPoint.create(
  name: 'Ostrów Wielkopolski',
  icao_code: 'EPOM',
  lat: 51.70075,
  lng: 17.846361,
  country: 'pl',
  radio: '122.2',
  status: :active,
  kind: :uncontrolled,
  declination: 4,
)

NavPoint.create(
  name: 'EPWR BRAVO',
  icao_code: 'EPWRB',
  lat: 51.134444,
  lng: 16.995,
  country: 'pl',
  status: :active,
  kind: :vfr_point,
  declination: 4,
)
