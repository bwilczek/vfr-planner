const initialState = {
  mapsApiLoaded: false,
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_MAPS_API_LOADED': {
      return {...state, mapsApiLoaded: action.payload}
    }
  }
  return state
}
