import React from 'react'
import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'
import ReactBootstrapSlider from 'react-bootstrap-slider'

import FlightPlanSlider from './FlightPlanSlider'
import LocaleSelector from './LocaleSelector'

import * as actions from '../actions/aeroDataActions'
import { updateUi } from '../actions/uiActions'

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
        <FormattedMessage id="aeronauticalData" /><br />
        <input type="checkbox" defaultChecked={this.props.ui.checkboxAirports} onChange={this.checkboxClicked.bind(this, 'checkboxAirports')}/>
        &nbsp;<FormattedMessage id="airports" />
        <br />
        <FlightPlanSlider name="windSpeed" value={this.props.flightPlan.windSpeed} min={0} max={50} step={5} />
        <FlightPlanSlider name="windDirection" value={this.props.flightPlan.windDirection} min={0} max={355} step={5} />
        <LocaleSelector />
      </div>
    )
  }
}
