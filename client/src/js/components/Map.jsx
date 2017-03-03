import React from 'react'
import { connect } from 'react-redux'
import { isEqual, each } from 'lodash'
import { injectIntl } from 'react-intl'

import GoogleMapsLoader from 'google-maps'

import * as secrets from '../secrets'
import { updateUi } from '../actions/uiActions'

import iconNavPointUncontrolled from '../../img/airfield.png'

GoogleMapsLoader.KEY = secrets.GOOGLE_MAPS_KEY

@injectIntl
@connect(
  (state) => {
    return {
      navPoints: state.navPoints,
      areas: state.areas,
      ui: state.ui
    }
  },
  (dispatch) => {
    return {
      updateUi: (fields) => {
        dispatch(updateUi(fields))
      }
    }
  }
)
export default class Map extends React.Component {

  constructor() {
    super()
    this.initMap = this.initMap.bind(this)
    this.map = null
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
  }

  onMarkerRightClick(marker) {
    const { formatMessage } = this.props.intl
    // console.log('Marker clicked ', marker.title, marker.navPoint)
    const content = `
      <strong>${marker.navPoint.name}</strong><br />
      ${formatMessage({id: 'navPointKind_'+marker.navPoint.kind})}
    `
    // radio, description, elevation
    const infowindow = new google.maps.InfoWindow({ content })
    infowindow.open(this.map, marker)
  }

  onMapClick(e) {
    // console.log('Map clicked')
  }

  onMapIdle(e) {
    this.props.updateUi({mapCenter: {lat: this.map.getCenter().lat(), lng: this.map.getCenter().lng()}})
  }

  onZoomChanged(e) {
    this.props.updateUi({mapZoom: this.map.getZoom()})
  }

  createNavPointMarker(navPoint) {
    const newMarker = new google.maps.Marker({
      position: {lat: navPoint.lat, lng: navPoint.lng},
      map: this.map,
      title: navPoint.name,
      navPoint: navPoint,
      icon: {
        url: iconNavPointUncontrolled, // TODO: replace with proper mapping of kind2image
        anchor: new google.maps.Point(12, 12)
      }
    });
    newMarker.addListener('rightclick', this.onMarkerRightClick.bind(this, newMarker))
    return newMarker
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
