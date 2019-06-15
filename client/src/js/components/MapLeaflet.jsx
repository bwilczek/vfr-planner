import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { isEqual, forEach, random } from 'lodash'
import { Map, TileLayer } from 'react-leaflet'
import * as L from 'leaflet'

import { getAirspacesForFilters } from '../selectors/airspaces'
import { getNavigationData } from '../selectors/navigationData'
import { addWaypointWithName } from '../actions/flightPlanActions'

@injectIntl
@connect(
  (state) => {
    return {
      navPoints: state.navPoints,
      airspaces: getAirspacesForFilters(state),
      ui: state.ui,
      waypoints: state.flightPlan.waypoints,
      navigationData: getNavigationData(state)
    }
  },
  (dispatch) => {
    return {
      addWaypointWithName: (waypoint, position = null) => {
        dispatch(addWaypointWithName(waypoint, position))
      }
    }
  }
)
export default class MapLeaflet extends React.Component {

  constructor() {
    super()
    this.map = null
    this.poly = null
    this.infoWindow = null
    this.navPointMarkers = []
    this.airspacePolygons = []
    this.minuteMarkers = []
    this.keyOfWaypointBeingDragged = null
    this.latLngOfMouseDown = null
  }

  componentDidMount() {
    this.initMap()
  }

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(this.props.waypoints, prevProps.waypoints)) {
      this.plotRoute()
    }
  }

  plotRoute() {
    this.poly.setLatLngs(this.props.waypoints.map((wp) => wp.latLng));
  }

  initMap() {
    this.poly = L.polyline(this.props.waypoints.map((wp) => wp.latLng));//.addTo(this.refs.leafletMap.leafletElement);
    this.poly.addTo(this.refs.leafletMap.leafletElement);
  }

  onMapClick(e) {
    this.props.addWaypointWithName({
      name: `WPT ${this.props.waypoints.length + 1}`,
      latLng: e.latlng,
      key: `${random(10000, 99999)}-${Date.now()}`
    })
  }

  render() {
     const position = [51, 17];
     return (
       <Map ref="leafletMap" center={position} zoom={8} onClick={this.onMapClick.bind(this)}>
         <TileLayer
           attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
           url='https://{s}.tile.osm.org/{z}/{x}/{y}.png'
         />
       </Map>
     );
   }

}
