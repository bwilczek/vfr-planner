const initialState = {
  columnGroundSpeed: true,
  columnCourseMag: true,
  columnHeading: true,
  columnSegmentDuration: true,
  columnSegmentDistance: true,
  columnCoords: false,
  columnSubTotalDuration: false
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_PRINT_SETTINGS': {
      return {...state, ...action.payload}
    }
  }
  return state
}
