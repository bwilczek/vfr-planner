import React from 'react'
import { connect } from 'react-redux'
import { throttle } from 'lodash'
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
      updateFlightPlan: (fields) => {
        dispatch(updateFlightPlan(fields))
      }
    }
  }
)
export default class UiRangeSlider extends React.Component {

  sliderMoved(fieldName, e) {
    const fields = {}
    fields[fieldName] = e.target.value
    this.props.updateFlightPlan(fields)
  }

  render() {
    return (
      <div class='planner-left-section'>
        <FormattedMessage id={this.props.name} />: {this.props.value[0]}-{this.props.value[1]}<br />
        <ReactBootstrapSlider
          name={this.props.name}
          value={this.props.value}
          change={throttle(this.sliderMoved.bind(this, this.props.name), 200)}
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
