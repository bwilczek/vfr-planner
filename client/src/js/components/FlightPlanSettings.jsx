import React from 'react'
import { connect } from 'react-redux'

import * as actions from '../actions/aeroDataActions'

@connect(
  undefined,
  (dispatch) => {
    return {
      fetchNavPoints: () => {
        dispatch(actions.fetchNavPoints(['pl'], ['uncontrolled']))
      },
      clearNavPoints: () => {
        dispatch(actions.clearNavPoints())
      }
    }
  }
)
export default class FlightPlanSettings extends React.Component {
  render() {
    return (
      <div>
        <a onClick={this.props.fetchNavPoints}>fetch some navPoints</a>
        <br />
        <a onClick={this.props.clearNavPoints}>clear navPoints</a>
      </div>
    )
  }
}
