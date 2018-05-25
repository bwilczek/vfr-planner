import React from 'react'
import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Button } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'

import FlightPlanSlider from './FlightPlanSlider'
import UiRangeSlider from './UiRangeSlider'
import NavPointCheckbox from './NavPointCheckbox'
import AirspaceSelector from './AirspaceSelector'
import FlightPlanDropdown from './FlightPlanDropdown'

import { fetchNavPoints, fetchAirspaces } from '../actions/aeroDataActions'
import { printFlightPlanModalShow } from '../actions/modalsActions'

@injectIntl
@connect(
  (state) => {
    return {
      ui: state.ui,
      flightPlan: state.flightPlan,
      googleMapsApiLoaded: state.google.mapsApiLoaded,
      navPointsPresent: state.navPoints.length > 0,
      airspacesPresent: state.airspaces.length > 0
    }
  }
)
export default class FlightPlanSettings extends React.Component {

  componentDidMount() {
    // make map content reflect the UI state
    if (!this.props.navPointsPresent) {
      if (this.props.ui.checkboxAirports) {
        this.props.dispatch(fetchNavPoints(this.props.ui.countries, ['controlled', 'uncontrolled', 'military']))
      }
      if (this.props.ui.checkboxOtherAerodromes) {
        this.props.dispatch(fetchNavPoints(this.props.ui.countries, ['airstrip', 'helipad', 'other_airstrip']))
      }
      if (this.props.ui.checkboxVfrPoints) {
        this.props.dispatch(fetchNavPoints(this.props.ui.countries, ['vfr_point']))
      }
      if (this.props.ui.checkboxIfrPoints) {
        this.props.dispatch(fetchNavPoints(this.props.ui.countries, ['ifr_point']))
      }
      if (this.props.ui.checkboxNavAids) {
        this.props.dispatch(fetchNavPoints(this.props.ui.countries, ['vor', 'ndb', 'vor_dme', 'dme']))
      }
    }
    if (this.props.ui.selectedAirspaces !== 'none' && !this.props.airspacesPresent) {
      this.props.dispatch(fetchAirspaces(this.props.ui.countries, this.props.ui.selectedAirspaces))
    }
  }

  render() {
    const handlePrintClick = () => { this.props.dispatch(printFlightPlanModalShow()) }
    return (
      <div>
        <FlightPlanDropdown />

        <Button style={{width: '189px', marginBottom: '5px', marginTop: '5px'}} disabled={this.props.flightPlan.waypoints.length < 2} onClick={handlePrintClick}>
          <div>
            <FontAwesome name="print" size="2x" style={{display: 'inline-block', height: '17px', verticalAlign: 'top'}}/>
            <div style={{display: 'inline-block', verticalAlign: 'bottom', height: '23px', marginLeft: '10px', marginTop: '5px', fontWeight: 'bold'}}>
              <FormattedMessage id="printFlightPlan"/>
            </div>
          </div>
        </Button>
        <div class="planner-left-section">
          <FormattedMessage id="aeronauticalData" />:<br />
          <NavPointCheckbox name="airports" value={this.props.ui.checkboxAirports} kinds={['controlled', 'uncontrolled', 'military']} />
          <NavPointCheckbox name="otherAerodromes" value={this.props.ui.checkboxOtherAerodromes} kinds={['airstrip', 'helipad', 'other_airstrip']} />
          <NavPointCheckbox name="vfrPoints" value={this.props.ui.checkboxVfrPoints} kinds={['vfr_point']} />
          <NavPointCheckbox name="ifrPoints" value={this.props.ui.checkboxIfrPoints} kinds={['ifr_point']} />
          <NavPointCheckbox name="navAids" value={this.props.ui.checkboxNavAids} kinds={['vor', 'ndb', 'vor_dme', 'dme']} />
        </div>
        <FlightPlanSlider name="tas" value={this.props.flightPlan.tas} min={20} max={300} step={5} unit={this.props.flightPlan.speedUnit} />
        <FlightPlanSlider name="windSpeed" value={this.props.flightPlan.windSpeed} min={0} max={50} step={1} unit='kt' />
        <FlightPlanSlider name="windDirection" value={this.props.flightPlan.windDirection} min={0} max={355} step={5} unit='°' />
        <UiRangeSlider name="levels" value={this.props.flightPlan.levels} min={0} max={9500} step={100} unit='ft'/>
        <UiRangeSlider name="hours" value={this.props.flightPlan.hours} min={4} max={24} step={1} />
        <AirspaceSelector />
      </div>
    )
  }
}
