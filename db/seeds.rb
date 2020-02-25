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
  description: 'Status: Ladowisko zarejestrowane; ICAO: EPWS; Radio: Szymanow-Radio 122.8; Kierunek ladowania (GEO): 144/324 (14/32); Wymiary pasa: 768 x 51 m; Elewacja: 390 ft = 119 m; Link: http://www.aeroklub.wroc.pl; AIP: http://ais.pansa.pl/vfr/aippliki/EP_AD_4_EPWS_3-0_en.pdf; AIP-txt: http://ais.pansa.pl/vfr/aippliki/EP_AD_4_EPWS_en.pdf; Kontakt: +48 713878716; Uwagi: Ladowisko Aeroklubu Wroclawskiego. Pas trawiasty, oznakowany. Nr ewid.ULC 7; Kamera: http://aero.webcam/epws/; Polozenie drog startowych: https://goo.gl/YUYo1h122.8'
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
  description: 'Status: Lotnisko; ICAO: EPOM; Radio: Michalkow-Radio 122.2; Kierunek ladowania (GEO): 114/294 (10/28); Wymiary pasa: 961 x 49 m; Elewacja: 469 ft = 143 m; Link: http://www.aeroklub.osw.pl; AIP: http://ais.pansa.pl/vfr/aippliki/EP_AD_4_EPOM_3-0_en.pdf; AIP-txt: http://ais.pansa.pl/vfr/aippliki/EP_AD_4_EPOM_en.pdf; Kontakt: +48 627352023; Uwagi: Lotnisko Aeroklubu Ostrowskiego. Pas trawiasty, oznakowany, utwardzony. Strefa spadochronowa w poludniowo-wschodniej czesci lotniska. Restauracja (bar) na terenie lotniska czynna w sezonie (poza sezonem czasem w weekendy). Nr rej.ULC 6; Kamera: http://aero.webcam/epom/; Polozenie drogi startowej: https://goo.gl/FJnSPD122.2'
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

NavPoint.new.tap do |p|
  p.name = 'EPDE GOLF'
  p.icao_code = 'EPDEG'
  p.kind = :vfr_point
  p.lng = 21.911389
  p.lat = 51.481389
  p.status = :active
  p.declination = 5.735
  p.country = 'pl'
end.save

NavPoint.new.tap do |p|
  p.name = 'EPDE NOVEMBER'
  p.icao_code = 'EPDEN'
  p.kind = :vfr_point
  p.lng = 21.938889
  p.lat = 51.586667
  p.status = :active
  p.declination = 5.735
  p.country = 'pl'
end.save

NavPoint.new.tap do |p|
  p.name = 'EPDE SIERRA'
  p.icao_code = 'EPDES'
  p.kind = :vfr_point
  p.lng = 21.866111
  p.lat = 51.523611
  p.status = :active
  p.declination = 5.735
  p.country = 'pl'
end.save

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
