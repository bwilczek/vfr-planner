import React from 'react'
import { connect } from 'react-redux'

// import GoogleMapsLoader from 'google-maps'
// import * as secrets from '../secrets'
// GoogleMapsLoader.KEY = secrets.GOOGLE_MAPS_KEY
// GoogleMapsLoader.LIBRARIES = ['geometry']

//import Map from '../components/Map'
import MapLeaflet from '../components/MapLeaflet'
import AllModals from '../components/modals'
import WaypointList from '../components/WaypointList'
import FlightPlanSettings from '../components/FlightPlanSettings'
import { setMapsApiLoaded } from '../actions/googleActions'
import { settingsModalShow } from '../actions/modalsActions'
import { fetchFlightPlan } from '../actions/flightPlanActions'

@connect(
  (state) => {
    return {
      googleMapsApiLoaded: true // state.google.mapsApiLoaded,
    }
  },
  (dispatch) => {
    return {
      // setMapsApiLoaded: (value) => {
      //   dispatch(setMapsApiLoaded(value))
      // },
      fetchFlightPlan: (planId) => {
        dispatch(fetchFlightPlan(planId))
      },
      settingsModalShow: () => {
        dispatch(settingsModalShow())
      }
    }
  }
)
export default class PlannerPage extends React.Component {

  componentDidMount() {
    if (this.props.params.planId) {
      this.props.fetchFlightPlan(this.props.params.planId)
    }
  }

  render() {
    if (this.props.googleMapsApiLoaded) {
      return (
        <div class="planner-wrapper">
          <div class="planner-left">
            <FlightPlanSettings />
            <AllModals />
          </div>
          <div class="planner-main"><MapLeaflet /></div>
          <div class="planner-right"><WaypointList /></div>
          <div class="clear"/>
        </div>
      )
    }
    // GoogleMaps not loaded yet
    return (
      <div>
        Waiting for the maps component to load...
      </div>
    )
  }
}
