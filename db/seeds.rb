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

Airspace.destroy_all

Airspace.create(
  name: 'ATZ EPWS',
  kind: :atz,
  country: 'pl',
  points: '16.8355555555556,51.2944444444444,0 16.8280555555556,51.3122222222222,0 17.0661111111111,51.3219444444444,0 17.1933333333333,51.1963888888889,0 16.8355555555556,51.2944444444444,0',
  description: 'Strefa ruchu nadlotniskowego lotniska Wrocław-Szymanów',
  level_min: 0,
  level_max: 2100,
  permanent: false
)
