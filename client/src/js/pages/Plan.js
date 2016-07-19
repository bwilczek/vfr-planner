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
    this.keyOfWaypointBeingDragged = null;
  }

  componentDidMount() {
    this.initMap();
    this.plotRoute();
  }

  componentWillUnmount() {
    this.saveMapState();
  }

  componentDidUpdate() {
    console.log('runGeocode');
    console.log(this.props.runGeocode);
    if(this.props.runGeocode) {
      this.props.dispatch(routeDataActions.reverseGeocode(this.props.runGeocode));
    }
    this.plotRoute();
  }

  saveMapState() {
    localStorageSetObject('mapState', {center: this.map.getCenter(), zoom: this.map.getZoom()});
  }

  plotRoute() {
    GoogleMapsLoader.load((google) => {
      if(this.polyline) {
        this.polyline.setMap(null);
      }
      if(this.markers.length > 0) {
        this.markers.forEach((m)=>m.setMap(null));
        this.markers = [];
      }
      this.polyline = new google.maps.Polyline({
        path: this.props.waypoints.map((wp)=>wp.latLng),
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });
      this.polyline.setMap(this.map);

      _.forEach(this.props.waypoints, (wp, i) => {
        let marker = new google.maps.Marker({
          position: wp.latLng,
          map: this.map,
          title: wp.name,
          draggable: true,
        });
        marker.waypoint = wp;
        marker.addListener('dragstart', (e) => {
          this.keyOfWaypointBeingDragged = marker.waypoint.key;
        });
        marker.addListener('dragend', (e) => {
          let waypoint = this.props.waypoints.filter((v)=>v.key==this.keyOfWaypointBeingDragged)[0];
          waypoint.latLng = e.latLng;
          this.props.dispatch(routeDataActions.updateWaypoint(waypoint));
          this.keyOfWaypointBeingDragged = null;
        });
        this.markers.push(marker);
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
        let waypoint = {
          latLng: e.latLng,
          name: `WPT ${this.props.waypoints.length+1}`,
          key: `${_.random(10000,99999)}-${Date.now()}`,
          marker: null,
        }
        this.props.dispatch(routeDataActions.addWaypoint(waypoint));
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
