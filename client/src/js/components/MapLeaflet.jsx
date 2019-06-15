import React from 'react'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'

export default class MapLeaflet extends React.Component {

  constructor() {
    super()
  }

  render() {
    return (
      <div ref="mapLeaflet" id="mapLeaflet">
        Mapa!
      </div>
    )
  }
}
