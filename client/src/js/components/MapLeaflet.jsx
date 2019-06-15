import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { random } from 'lodash'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'

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
       <Map center={position} zoom={8} onClick={this.onMapClick.bind(this)}>
         <TileLayer
           attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
           url='https://{s}.tile.osm.org/{z}/{x}/{y}.png'
         />
         <Marker position={position}>
           <Popup>
             A pretty CSS3 popup. <br/> Easily customizable.
           </Popup>
         </Marker>
       </Map>
     );
   }

}
