import React from "react";
import { connect } from 'react-redux';
import * as routeDataActions from '../actions/routeDataActions';

const GoogleMapsLoader = require('google-maps');
GoogleMapsLoader.KEY = secrets.GOOGLE_MAPS_KEY;

import * as secrets from '../secrets';
import WaypointList from '../components/WaypointList';
import { localStorageGetObject, localStorageSetObject } from '../lib/LocalStorageForObjects'

@connect((store) => {
  return _.cloneDeep(store.routeData);
})
export default class Plan extends React.Component {

  constructor() {
    super();
    this.initMap = this.initMap.bind(this);
    this.saveMapState = this.saveMapState.bind(this);
    this.map = null;
    this.polyline = null;
    this.markers = [];
  }

  componentDidMount() {
    this.initMap();
    console.log('componentDidMount ', this.props.waypoints.length);
    this.plotRoute();
  }

  componentWillUnmount() {
    this.saveMapState();
  }

  componentDidUpdate() {
    this.plotRoute();
  }

  saveMapState() {
    localStorageSetObject('mapState', {center: this.map.getCenter(), zoom: this.map.getZoom()});
  }

  plotRoute() {
    GoogleMapsLoader.load((google) => {
      console.log('plotRoute');
      if(this.polyline) {
        this.polyline.setMap(null);
      }
      this.polyline = new google.maps.Polyline({
        path: this.props.waypoints,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });
      this.polyline.setMap(this.map);

      _.forEach(this.props.waypoints, (latLng, i) => {
        let marker = new google.maps.Marker({
          position: latLng,
          map: this.map,
          draggable: true,
          // title: 'Hello World!'
        });
        marker.customData = 'kasia';
        marker.addListener('dragstart', (e) => {
          console.log('dragstart ', e.latLng.lat(), ' ', e.latLng.lng(), ' ', this.map.getCenter());
        });
        marker.addListener('dragend', (e) => {
          console.log('dragend ', e.latLng.lat(), ' ', e.latLng.lng());
        });
        console.log('test custom data setting ', marker.customData);
      }); //forEach

    })
  }

  initMap() {
    let center = {lat: 51, lng: 17};
    let zoom = 8;
    const mapState = localStorageGetObject('mapState');
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
        this.props.dispatch(routeDataActions.addWaypoint(e.latLng));
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
