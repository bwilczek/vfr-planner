const initialState = {
  columnGroundSpeed: true,
  columnCourse: true,
  columnHeading: true,
  columnSegmentDuration: true,
  columnSegmentDistance: true
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_PRINT_SETTINGS': {
      return {...state, ...action.payload}
    }
  }
  return state
}
