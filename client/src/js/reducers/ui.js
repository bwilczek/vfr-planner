const initialState = {
  mapZoom: 8,
  mapCenter: {lat: 51, lng: 17},
  checkboxAirports: false,
  checkboxOtherAerodromes: false,
  checkboxVfrPoints: false,
  countries: ['pl'],
  selectedAirspaces: 'all',
  levels: [500, 1800],
  hours: [8, 12]
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_UI': {
      return {...state, ...action.payload}
    }
  }
  return state
}
