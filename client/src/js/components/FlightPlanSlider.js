import React from 'react'
import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'
import ReactBootstrapSlider from 'react-bootstrap-slider'

import { updateFlightPlan } from '../actions/flightPlanActions'

import '../../css/bootstrap-slider.min.css'
import '../../css/bootstrap-slider.custom.css'

@injectIntl
@connect(
  undefined,
  (dispatch) => {
    return {
      handleFlightPlanChange: (fields) => {
        dispatch(updateFlightPlan(fields))
      }
    }
  }
)
export default class FlightPlanSlider extends React.Component {

  sliderMoved(sliderName, e) {
    const fields = {}
    fields[sliderName] = e.target.value
    this.props.handleFlightPlanChange(fields)
  }

  render() {
    return (
      <div>
      <FormattedMessage id={this.props.name} /> {this.props.value}<br />
        <ReactBootstrapSlider
          name={this.props.name}
          value={this.props.value}
          change={this.sliderMoved.bind(this, this.props.name)}
          step={this.props.step}
          max={this.props.max}
          min={this.props.min}
          orientation="horizontal"
          handle="custom"
          tooltip="hide"
        />
      </div>
    )
  }
}
