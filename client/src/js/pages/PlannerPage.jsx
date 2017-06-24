import React from 'react'
import { connect } from 'react-redux'

import GoogleMapsLoader from 'google-maps'
import * as secrets from '../secrets'
GoogleMapsLoader.KEY = secrets.GOOGLE_MAPS_KEY
GoogleMapsLoader.LIBRARIES = ['geometry']

import Map from '../components/Map'
import WaypointList from '../components/WaypointList'
import FlightPlanSettings from '../components/FlightPlanSettings'
import { setMapsApiLoaded } from '../actions/googleActions'
import { settingsModalShow } from '../actions/modalsActions'
import { fetchFlightPlan } from '../actions/flightPlanActions'

@connect(
  (state) => {
    return {
      googleMapsApiLoaded: state.google.mapsApiLoaded,
    }
  },
  (dispatch) => {
    return {
      setMapsApiLoaded: (value) => {
        dispatch(setMapsApiLoaded(value))
      },
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
    GoogleMapsLoader.load((g) => {
      this.props.setMapsApiLoaded(true)
    })
  }

  componentDidUpdate() {
    if (this.props.location.pathname === '/settings') {
      this.props.settingsModalShow()
    }
    if (this.props.params.planId) {
      this.props.fetchFlightPlan(this.props.params.planId)
      // TODO dispatch(updateUi({ mapCenter: { lat: response.data.waypoints[0].latLng.lat, lng: response.data.waypoints[0].latLng.lng } }))
    }
  }

  render() {
    if (this.props.googleMapsApiLoaded) {
      return (
        <div class="planner-wrapper">
          <div class="planner-left"><FlightPlanSettings /></div>
          <div class="planner-main"><Map /></div>
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
