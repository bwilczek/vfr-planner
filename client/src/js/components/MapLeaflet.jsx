import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { isEqual, forEach, random } from 'lodash'
import { Map, TileLayer, Popup, LatLngBounds} from 'react-leaflet'
import * as L from 'leaflet'

import { updateUi } from '../actions/uiActions'
import { getAirspacesForFilters } from '../selectors/airspaces'
import { getNavigationData } from '../selectors/navigationData'
import { addWaypoint, addWaypointWithName } from '../actions/flightPlanActions'
import * as format from '../lib/Formatter'
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
      },
      addWaypoint: (waypoint, position = null) => {
        dispatch(addWaypoint(waypoint, position))
      },
      updateUi: (fields) => {
        dispatch(updateUi(fields))
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
    if (!isEqual(this.props.ui.mapCenter, prevProps.ui.mapCenter)) {
      this.map.setView(this.props.ui.mapCenter, this.props.ui.mapZoom)
    }
  }

  onMarkerClick(marker) {
    console.log ("click on marker ", marker)
    console.log ("click on marker.title ", marker.options.title)
    console.log ("click on marker.navPoint ", marker.navPoint)
    let name = marker.navPoint.icao_code ? marker.navPoint.icao_code : marker.navPoint.name
    this.props.addWaypoint({
      name: name,
      radio: marker.navPoint.radio,
      elevation: marker.navPoint.elevation,
      declination: marker.navPoint.declination,
      latLng: marker.getLatLng(),
      coords: format.coords(marker.getLatLng()),
      key: `${random(10000, 99999)}-${Date.now()}`
    })
  }

  onMarkerRightClick(marker) {
    console.log ("RIGHT click on marker/map ", marker,this.map)
    const { formatMessage } = this.props.intl
    let content = `
      <strong>${marker.navPoint.icao_code || ''} ${marker.navPoint.name}</strong><br />
      ${formatMessage({id: 'navPointKind_' + marker.navPoint.kind})}<br />`

    if (marker.navPoint.description) {
      content += `<hr />${marker.navPoint.description}`
    }

    if (marker.navPoint.radio) {
      content += marker.navPoint.radio
    }

    const popup = L.popup()
    .setLatLng(marker.getLatLng())
    .setContent(content)
    .openOn(this.map);
  }

  onAirspaceRightClick(e) {
    console.log('Eeeeeee',e)
    let content = ''
    forEach(this.airspacePolygons, (poly) => {
      console.log('Poooly',poly)
      console.log('Pooolybounds',poly.getBounds())
      let bounds = poly.getBounds()
      if (!bounds.contains(e.latlng)) {
        return
      }
      content += `
      <strong>${poly.airspace.name}</strong><br />
      ${poly.airspace.level_min}ft - ${poly.airspace.level_max}ft<br />
      ${format.hour(poly.airspace.time_from)} - ${format.hour(poly.airspace.time_to)} UTC<br />
      ${poly.airspace.description}
      <hr />
      `
    })

    const popup = L.popup()
    .setLatLng(e.latlng)
    .setContent(content)
    .openOn(this.map);
  }

  plotNavPoints() {
    // CLEAR navPointMarkers
    forEach(this.navPointMarkers, (marker) => {
      marker.removeFrom(this.map);
    })
    this.navPointMarkers = []
    // PLOT navPointMarkers
    forEach(this.props.navPoints, (navPoint) => {
      this.navPointMarkers = [...this.navPointMarkers, this.createNavPointMarker(navPoint)]
    })
  }

  createNavPointMarker(navPoint) {
    const latLng = L.latLng(navPoint.lat, navPoint.lng)
    const icon = L.icon({iconUrl: getIconForNavPointKind(navPoint.kind), iconAnchor: [12, 12]})
    const newMarker = L.marker(latLng, {icon: icon, title: navPoint.name})
    newMarker.navPoint = navPoint
    newMarker.addTo(this.map)
    newMarker.on('click', this.onMarkerClick.bind(this, newMarker))
    newMarker.on('contextmenu', this.onMarkerRightClick.bind(this, newMarker))
    return newMarker
  }

  plotAirspaces() {
     // CLEAR airspacePolygons
     forEach(this.airspacePolygons, (polygon) => {
       polygon.removeFrom(this.map);
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
     polygon.addTo(this.map);
     polygon.on('contextmenu',this.onAirspaceRightClick.bind(this))
     return polygon
   }

  plotRoute() {
    this.poly.setLatLngs(this.props.waypoints.map((wp) => wp.latLng));
  }

  initMap() {
    this.map = this.refs.leafletMap.leafletElement
    this.map.on('click', this.onMapClick.bind(this))
    this.map.setView(this.props.ui.mapCenter, this.props.ui.mapZoom);
    this.map.on('moveend', this.onMapIdle.bind(this))
    this.map.on('zoomend', this.onZoomChanged.bind(this))

    this.poly = L.polyline(this.props.waypoints.map((wp) => wp.latLng))
    this.poly.addTo(this.map)

    // this.infoWindow = new google.maps.InfoWindow()
    // this.poly = new google.maps.Polyline({
    //   map: this.map,
    //   path: this.props.waypoints.map((wp) => wp.latLng),
    //   strokeColor: '#FF0000',
    //   strokeOpacity: 1.0,
    //   strokeWeight: 3,
    //   geodesic: true,
    //   editable: true,
    //   suppressUndo: true,
    //   clickable: false,
    // })
    // this.poly.addListener('mousedown', this.onPolyMouseDown.bind(this))
    // this.poly.addListener('mouseup', this.onPolyMouseUp.bind(this))
  }

  onMapClick(e) {
    this.props.addWaypointWithName({
      name: `WPT ${this.props.waypoints.length + 1}`,
      latLng: e.latlng,
      key: `${random(10000, 99999)}-${Date.now()}`
    })
  }

  onMapIdle(e) {
    this.props.updateUi({mapCenter: {lat: this.map.getCenter().lat, lng: this.map.getCenter().lng}})
  }

  onZoomChanged(e) {
    this.props.updateUi({mapZoom: this.map.getZoom()})
  }

  render() {
     return (
       <Map ref="leafletMap">
         <TileLayer
           attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
           url='https://{s}.tile.osm.org/{z}/{x}/{y}.png'
         />
       </Map>
     );
   }

}
