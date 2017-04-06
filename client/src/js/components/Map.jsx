import React from 'react'
import { connect } from 'react-redux'
import { isEqual, each } from 'lodash'
import { injectIntl } from 'react-intl'

import GoogleMapsLoader from 'google-maps'

import * as secrets from '../secrets'
import { updateUi } from '../actions/uiActions'
import { addWaypointWithName } from '../actions/flightPlanActions'

import iconNavPointUncontrolled from '../../img/airfield.png'
import iconNavPointVfrPoint from '../../img/vfr_point.png'

GoogleMapsLoader.KEY = secrets.GOOGLE_MAPS_KEY

@injectIntl
@connect(
  (state) => {
    return {
      navPoints: state.navPoints,
      areas: state.areas,
      ui: state.ui,
      waypoints: state.flightPlan.waypoints
    }
  },
  (dispatch) => {
    return {
      updateUi: (fields) => {
        dispatch(updateUi(fields))
      },
      addWaypoint: (waypoint) => {
        dispatch(addWaypointWithName(waypoint))
      }
    }
  }
)
export default class Map extends React.Component {

  constructor() {
    super()
    this.initMap = this.initMap.bind(this)
    this.map = null
    this.poly = null
    this.navPointMarkers = []
  }

  defaultMapSettings() {
    return {
      center: this.props.ui.mapCenter,
      zoom: this.props.ui.mapZoom,
      draggableCursor: 'crosshair'
    }
  }

  componentDidMount() {
    this.initMap()
  }

  componentDidUpdate(prevProps, prevState) {
    if(!isEqual(this.props.navPoints, prevProps.navPoints)) {
      this.plotNavPoints()
    }
    if(!isEqual(this.props.waypoints, prevProps.waypoints)) {
      this.plotRoute()
    }
  }

  onMarkerClick(marker) {
    this.props.addWaypoint({name: marker.navPoint.name, id: this.props.waypoints.length+1, latLng: marker.position})
  }

  onMarkerRightClick(marker) {
    const { formatMessage } = this.props.intl
    const content = `
      <strong>${marker.navPoint.name}</strong><br />
      ${formatMessage({id: 'navPointKind_'+marker.navPoint.kind})}
    `
    // radio, description, elevation
    const infowindow = new google.maps.InfoWindow({ content })
    infowindow.open(this.map, marker)
  }

  onMapClick(e) {
    this.props.addWaypoint({name: `WPT ${this.props.waypoints.length+1}`, latLng: e.latLng, key: `${_.random(10000,99999)}-${Date.now()}`})
    this.poly.getPath().push(e.latLng)
  }

  onMapIdle(e) {
    this.props.updateUi({mapCenter: {lat: this.map.getCenter().lat(), lng: this.map.getCenter().lng()}})
  }

  onZoomChanged(e) {
    this.props.updateUi({mapZoom: this.map.getZoom()})
  }

  getIconForNavPointKind(kind) {
    switch(kind) {
      case 'vfr_point':
        return iconNavPointVfrPoint
      case 'uncontrolled':
        return iconNavPointUncontrolled
    }
  }

  createNavPointMarker(navPoint) {
    const latLng = new google.maps.LatLng(navPoint.lat, navPoint.lng)
    const newMarker = new google.maps.Marker({
      position: latLng,
      map: this.map,
      title: navPoint.name,
      navPoint: navPoint,
      icon: {
        url: this.getIconForNavPointKind(navPoint.kind),
        anchor: new google.maps.Point(12, 12)
      }
    });
    newMarker.addListener('rightclick', this.onMarkerRightClick.bind(this, newMarker))
    newMarker.addListener('click', this.onMarkerClick.bind(this, newMarker))
    return newMarker
  }

  plotRoute() {
    console.log("Plot route")
  }

  plotNavPoints() {
    if(!this.map) {
      console.log("Waiting for the map before drawing NavPoints")
      setTimeout(this.plotNavPoints.bind(this), 50)
    } else {
      // CLEAR navPointMarkers
      each(this.navPointMarkers, (marker) => {
        marker.setMap(null)
      })
      this.navPointMarkers = []
      // PLOT navPointMarkers
      each(this.props.navPoints, (navPoint) => {
        this.navPointMarkers = [...this.navPointMarkers, this.createNavPointMarker(navPoint)]
      })
    }
  }

  plotAreas() {
    // console.log("read Areas from state (via prop) and plot them on the map")
  }

  initMap() {
    GoogleMapsLoader.load((google) => {
      this.map = new google.maps.Map(this.refs.map, this.defaultMapSettings())
      this.map.addListener('click', this.onMapClick.bind(this))
      this.map.addListener('idle', this.onMapIdle.bind(this))
      this.map.addListener('zoom_changed', this.onZoomChanged.bind(this))
      this.poly = new google.maps.Polyline({
        strokeColor: '#000000',
        strokeOpacity: 1.0,
        strokeWeight: 3,
        geodesic: true,
        editable: true
      })
      this.poly.setMap(this.map)
    })
  }

  render() {
    return (
      <div ref="map" id="map">
        Mapa!
      </div>
    )
  }
}
