const initialState = {
  mapZoom: 8,
  mapCenter: {lat: 51, lng: 17},
  checkboxAirports: false,
  checkboxOtherAerodromes: false,
  checkboxVfrPoints: false,
  checkboxIfrPoints: false,
  checkboxNavAids: false,
  countries: ['pl'],
  selectedAirspaces: 'today',
  flightMode: false
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_UI': {
      return {...state, ...action.payload}
    }
  }
  return state
}
