import React from 'react'

import GoogleMapsLoader from 'google-maps'

import * as secrets from '../secrets'

GoogleMapsLoader.KEY = secrets.GOOGLE_MAPS_KEY

export default class Map extends React.Component {

  constructor() {
    super()
    this.initMap = this.initMap.bind(this)
    this.map = null
  }

  componentDidMount() {
    this.initMap()
  }

  initMap() {
    GoogleMapsLoader.load((google) => {
      this.map = new google.maps.Map(this.refs.map, {
        center: {lat: 51, lng: 17},
        zoom: 8,
        draggableCursor: 'crosshair'
      })
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
