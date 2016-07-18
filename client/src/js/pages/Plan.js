import React from "react";

const GoogleMapsLoader = require('google-maps');
GoogleMapsLoader.KEY = secrets.GOOGLE_MAPS_KEY;

import * as secrets from '../secrets';
import WaypointList from '../components/WaypointList';
import { localStorageGetObject, localStorageSetObject } from '../lib/LocalStorageForObjects'

export default class Plan extends React.Component {

  constructor() {
    super();
    this.initMap = this.initMap.bind(this);
    this.saveMapState = this.saveMapState.bind(this);
    this.map = null;
  }

  componentDidMount() {
    this.initMap();
  }

  componentWillUnmount() {
    this.saveMapState();
  }

  saveMapState() {
    localStorageSetObject('mapState', {center: this.map.getCenter(), zoom: this.map.getZoom()});
  }

  initMap() {
    let center = {lat: 51, lng: 17};
    let zoom = 8;
    const mapState = localStorageGetObject('mapState');
    console.log(mapState);
    if(mapState !== null) {
      center = mapState.center;
      zoom = mapState.zoom;
    }
    GoogleMapsLoader.load((google) => {
      this.map = new google.maps.Map(this.refs.map, {
        center: center,
        zoom: zoom
      });

      this.map.addListener('click', (e) => {
        console.log(`${e.latLng.lat()} ${e.latLng.lng()}`);
      });

      this.map.addListener('idle', (e) => {
        this.saveMapState();
      });

    });
  }


  render() {
    const mapStyle = {
      height: 'calc( 100vh - 45px )',
      overflow: 'hidden',
      float: 'left',
      width: '100%',
    }
    const sidebarStyle = {
      float: 'left',
      width: '200px',
      marginRight: '-200px',
    }
    const wrapperStyle = {
      marginRight: '200px'
    }
    const clearStyle = {
      clear: 'both'
    }
    return (
      <div style={wrapperStyle}>
        <div ref='map' style={mapStyle}>loading map...</div>
        <div ref='sidebar' style={sidebarStyle} >
          <WaypointList />
        </div>
        <div style={clearStyle} />
      </div>
    );
  }
}
