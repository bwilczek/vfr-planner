import React from 'react'
import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'

import FlightPlanSlider from './FlightPlanSlider'
import UiRangeSlider from './UiRangeSlider'
import NavPointCheckbox from './NavPointCheckbox'
import AirspaceSelector from './AirspaceSelector'

import { fetchNavPoints, fetchAirspaces } from '../actions/aeroDataActions'

@injectIntl
@connect(
  (state) => {
    return {
      ui: state.ui,
      flightPlan: state.flightPlan,
      googleMapsApiLoaded: state.google.mapsApiLoaded
    }
  }
)
export default class FlightPlanSettings extends React.Component {

  componentDidMount() {
    // make map content reflect the UI state
    if (this.props.ui.checkboxAirports) {
      this.props.dispatch(fetchNavPoints(this.props.ui.countries, ['controlled', 'uncontrolled', 'military']))
    }
    if (this.props.ui.checkboxOtherAerodromes) {
      this.props.dispatch(fetchNavPoints(this.props.ui.countries, ['airstrip', 'helipad', 'other_airstrip']))
    }
    if (this.props.ui.checkboxVfrPoints) {
      this.props.dispatch(fetchNavPoints(this.props.ui.countries, ['vfr_point']))
    }
    if (this.props.ui.selectedAirspaces !== 'none') {
      this.props.dispatch(fetchAirspaces(this.props.ui.countries, this.props.ui.selectedAirspaces))
    }
  }

  render() {
    return (
      <div>
        <FormattedMessage id="aeronauticalData" /><br />
        <NavPointCheckbox name="airports" value={this.props.ui.checkboxAirports} kinds={['controlled', 'uncontrolled', 'military']} />
        <NavPointCheckbox name="otherAerodromes" value={this.props.ui.checkboxOtherAerodromes} kinds={['airstrip', 'helipad', 'other_airstrip']} />
        <NavPointCheckbox name="vfrPoints" value={this.props.ui.checkboxVfrPoints} kinds={['vfr_point']} />
        <FlightPlanSlider name="tas" value={this.props.flightPlan.tas} min={20} max={200} step={5} />
        <FlightPlanSlider name="windSpeed" value={this.props.flightPlan.windSpeed} min={0} max={50} step={5} />
        <FlightPlanSlider name="windDirection" value={this.props.flightPlan.windDirection} min={0} max={355} step={5} />
        <UiRangeSlider name="levels" value={this.props.ui.levels} min={0} max={9500} step={100} />
        <UiRangeSlider name="hours" value={this.props.ui.hours} min={4} max={24} step={1} />
        <AirspaceSelector />
      </div>
    )
  }
}
