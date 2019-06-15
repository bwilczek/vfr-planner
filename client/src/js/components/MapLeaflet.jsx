import React from 'react'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'

export default class MapLeaflet extends React.Component {

  constructor() {
    super()
  }

  render() {
     const position = [51, 17];
     return (
       <Map center={position} zoom={13}>
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
