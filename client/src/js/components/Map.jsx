import React from 'react'
import { connect } from 'react-redux'
import { isEqual, each } from 'lodash'

import GoogleMapsLoader from 'google-maps'

import * as secrets from '../secrets'

import iconNavPointUncontrolled from '../../img/airfield.png'

GoogleMapsLoader.KEY = secrets.GOOGLE_MAPS_KEY

@connect(
  (state) => {
    return {
      navPoints: state.navPoints,
      areas: state.areas
    }
  }
)
export default class Map extends React.Component {

  defaultMapSettings = {
    center: {lat: 51, lng: 17}, // TODO: store center and zoom in state
    zoom: 8,
    draggableCursor: 'crosshair'
  }

  constructor() {
    super()
    this.initMap = this.initMap.bind(this)
    this.map = null
    this.navPointMarkers = []
  }

  componentDidMount() {
    this.initMap()
  }

  componentDidUpdate(prevProps, prevState) {
    if(!isEqual(this.props.navPoints, prevProps.navPoints)) {
      this.plotNavPoints()
    }
  }

  onMarkerClick(marker) {
    console.log('Marker clicked ', marker.title)
  }

  onMapClick(e) {
    // console.log('Map clicked')
  }

  plotNavPoints() {
    // CLEAR navPointMarkers
    each(this.navPointMarkers, (marker) => {
      marker.setMap(null)
    })
    this.navPointMarkers = []
    // PLOT navPointMarkers
    each(this.props.navPoints, (item) => {
      const newMarker = new google.maps.Marker({
        position: {lat: item.lat, lng: item.lng},
        map: this.map,
        title: item.name,
        icon: {
          url: iconNavPointUncontrolled, // TODO: replace with proper mapping of kind2image
          anchor: new google.maps.Point(12, 12)
        }
      });
      newMarker.addListener('click', this.onMarkerClick.bind(this, newMarker))
      this.navPointMarkers = [...this.navPointMarkers, newMarker]
    })
  }

  plotAreas() {
    // console.log("read Areas from state (via prop) and plot them on the map")
  }

  initMap() {
    GoogleMapsLoader.load((google) => {
      this.map = new google.maps.Map(this.refs.map, this.defaultMapSettings)
      this.map.addListener('click', this.onMapClick.bind(this))
      this.plotNavPoints()
      this.plotAreas()
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
