import React from 'react'
import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'
import ReactBootstrapSlider from 'react-bootstrap-slider'

import * as actions from '../actions/aeroDataActions'
import { updateUi } from '../actions/uiActions'
import { updateFlightPlan } from '../actions/flightPlanActions'

import '../../css/bootstrap-slider.min.css'
import '../../css/bootstrap-slider.custom.css'

@injectIntl
@connect(
  (state) => {
    return {
      ui: state.ui,
      flightPlan: state.flightPlan
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
      },
      handleFlightPlanChange: (fields) => {
        dispatch(updateFlightPlan(fields))
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

  sliderMoved(sliderName, e) {
    const fields = {}
    fields[sliderName] = e.target.value
    this.props.handleFlightPlanChange(fields)
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
        <FormattedMessage id="aeronauticalData" /><br />
        <input type="checkbox" defaultChecked={this.props.ui.checkboxAirports} onChange={this.checkboxClicked.bind(this, 'checkboxAirports')}/>
        &nbsp;<FormattedMessage id="airports" />
        <br />
        <FormattedMessage id="windSpeed" /> {this.props.flightPlan.windSpeed}<br />
        <ReactBootstrapSlider
          name="windSpeed"
          value={this.props.flightPlan.windSpeed}
          change={this.sliderMoved.bind(this, 'windSpeed')}
          step={5}
          max={355}
          min={0}
          orientation="horizontal"
          handle="custom"
          tooltip="hide"
        />

      </div>
    )
  }
}
