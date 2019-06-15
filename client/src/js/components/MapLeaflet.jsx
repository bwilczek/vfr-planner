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
import { getIconForNavPointKind, createAirspaceRawPolygon } from '../lib/MapUtils'

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
    this.plotAirspaces()
    this.plotNavPoints()
  }

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(this.props.waypoints, prevProps.waypoints)) {
      this.plotRoute()
    }
    if (!isEqual(this.props.airspaces, prevProps.airspaces)) {
      this.plotAirspaces()
    }
    if (!isEqual(this.props.navPoints, prevProps.navPoints)) {
      this.plotNavPoints()
    }
  }

  plotNavPoints() {
    // CLEAR navPointMarkers
    forEach(this.navPointMarkers, (marker) => {
      marker.removeFrom(this.refs.leafletMap.leafletElement);
    })
    this.navPointMarkers = []
    // PLOT navPointMarkers
    forEach(this.props.navPoints, (navPoint) => {
      this.navPointMarkers = [...this.navPointMarkers, this.createNavPointMarker(navPoint)]
    })
  }

  createNavPointMarker(navPoint) {
    const latLng = L.latLng(navPoint.lat, navPoint.lng)
    const icon = L.icon({iconUrl: getIconForNavPointKind(navPoint.kind)})
    const newMarker = L.marker(latLng, {icon: icon, title: navPoint.name});
    newMarker.addTo(this.refs.leafletMap.leafletElement);
    //TODO@mondem
    // newMarker.addListener('rightclick', this.onMarkerRightClick.bind(this, newMarker))
    // newMarker.addListener('click', this.onMarkerClick.bind(this, newMarker))
    return newMarker
  }

  plotAirspaces() {
     // CLEAR airspacePolygons
     forEach(this.airspacePolygons, (polygon) => {
       polygon.removeFrom(this.refs.leafletMap.leafletElement);
     })
     this.airspacePolygons = []
     // PLOT airspacePolygons
     forEach(this.props.airspaces, (airspace) => {
       switch (airspace.kind) {
         case 'ignore':
         case 'fis':
         case 'adiz':
           // TODO: make it a polyline
           break
         default:
           this.airspacePolygons.push(this.createAirspacePolygon(airspace))
       }
     })
   }

   createAirspacePolygon(airspace) {
     let polygon = createAirspaceRawPolygon(airspace)
     polygon.addTo(this.refs.leafletMap.leafletElement);
     return polygon
   }

  plotRoute() {
    this.poly.setLatLngs(this.props.waypoints.map((wp) => wp.latLng));
  }

  initMap() {
    this.poly = L.polyline(this.props.waypoints.map((wp) => wp.latLng));
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
