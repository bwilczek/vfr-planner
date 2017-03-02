import React from 'react'
import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'
import ReactBootstrapSlider from 'react-bootstrap-slider'

import * as actions from '../actions/aeroDataActions'
import { updateUi } from '../actions/uiActions'

import '../../css/bootstrap-slider.min.css'
import '../../css/bootstrap-slider.custom.css'

@injectIntl
@connect(
  (state) => {
    return {
      ui: state.ui
    }
  },
  (dispatch) => {
    return {
      fetchAirports: () => {
        dispatch(actions.fetchNavPoints(['pl'], ['controlled', 'uncontrolled', 'military']))
      },
      clearAirports: () => {
        dispatch(actions.clearNavPointsByKind(['controlled', 'uncontrolled', 'military']))
      },
      handleCheckboxClick: (fields) => {
        dispatch(updateUi(fields))
      }
    }
  }
)
export default class FlightPlanSettings extends React.Component {

  checkboxClicked(checkboxName) {
    const fields = {}
    fields[checkboxName] = !this.props.ui[checkboxName]
    this.props.handleCheckboxClick(fields)
    if(this.props.ui[checkboxName]) {
      this.props.clearAirports()
    } else {
      this.props.fetchAirports()
    }
  }

  componentDidMount() {
    // make map content reflect the UI state
    if(this.props.ui.checkboxAirports) {
      this.props.fetchAirports()
    }
  }

  render() {
    return (
      <div>
        Aeronautical data:<br />
        <input type="checkbox" defaultChecked={this.props.ui.checkboxAirports} onChange={this.checkboxClicked.bind(this, 'checkboxAirports')}/><FormattedMessage id="airports" />
        <br />
        <ReactBootstrapSlider
          value={90}
          change={console.log}
          slideStop={console.log}
          step={5}
          max={355}
          min={0}
          orientation="horizontal"
          handle="custom"
        />

      </div>
    )
  }
}
