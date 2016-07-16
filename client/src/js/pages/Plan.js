import React from "react";

const GoogleMapsLoader = require('google-maps');

import * as secrets from '../secrets';

export default class Plan extends React.Component {

  constructor() {
    super();
    this.initMap = this.initMap.bind(this);
    this.map = null;
  }

  componentWillMount() {
    this.initMap();
  }

  initMap() {
    GoogleMapsLoader.KEY = secrets.GOOGLE_MAPS_KEY;
    GoogleMapsLoader.load((google) => {
        this.map = new google.maps.Map(this.refs.map, {
          center: {lat: -34.397, lng: 150.644},
          zoom: 8
        });
    });
  }

  render() {
    const mapStyle = { height: '100vh' }
    return (
      <div>
        <div ref='map' style={mapStyle} />
      </div>
    );
  }
}
