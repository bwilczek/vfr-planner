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
    if(this.props.location.pathname === "/settings") {
      this.props.settingsModalShow()
    }
    // TODO: detect if this.props.params.planId is set, if so fetch the data
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
