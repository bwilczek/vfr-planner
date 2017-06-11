import React from 'react'
import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'
import ReactBootstrapSlider from 'react-bootstrap-slider'

import { updateUi } from '../actions/uiActions'

import '../../css/bootstrap-slider.min.css'
import '../../css/bootstrap-slider.custom.css'

@injectIntl
@connect(
  undefined,
  (dispatch) => {
    return {
      updateUi: (fields) => {
        dispatch(updateUi(fields))
      }
    }
  }
)
export default class UiRangeSlider extends React.Component {

  sliderMoved(fieldName, e) {
    const fields = {}
    fields[fieldName] = e.target.value
    this.props.updateUi(fields)
  }

  render() {
    return (
      <div class='planner-left-section'>
        <FormattedMessage id={this.props.name} />: {this.props.value[0]}-{this.props.value[1]}<br />
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
