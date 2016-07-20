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
    this.plotRoute();
  }

  saveMapState() {
    localStorageSetObject('mapState', {center: this.map.getCenter(), zoom: this.map.getZoom()});
  }

  plotRoute() {
    console.log('plotRoute')
    GoogleMapsLoader.load((google) => {
      if(this.polyline) {
        this.polyline.setMap(null);
      }
      this.polyline = new google.maps.Polyline({
        path: this.props.waypoints.map((wp)=>wp.latLng),
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 3,
        editable: true,
        geodesic: true,
        suppressUndo: true,
        clickable: false,
      });
      this.polyline.addListener('mousedown', (e) => {
        console.log('poly:mousedown');
        console.log(e);
        console.log(e.latLng.toString());
        if(e.vertex !== undefined) {
          this.keyOfWaypointBeingDragged = this.props.waypoints[e.vertex].key;
        }
      });
      this.polyline.addListener('mouseup', (e) => {
        // FIXME: please excuse this ugly hack - e.latLng is buggy and shows same location as onmousedown. Need to report it to Google Maps API
        setTimeout(() => {
          console.log('poly:mouseup deferred');
          // WAYPOINT MOVED/CLICKED
          if(e.vertex !== undefined) {
            if(e.latLng == this.polyline.getPath().getAt(e.vertex)) {
              // WAYPOINT CLICKED
              console.log(`seems that waypoint ${this.props.waypoints[e.vertex].name} was clicked`)
              e.stop();
              return;
            }
            let newLatLng = this.polyline.getPath().getAt(e.vertex)
            console.log(newLatLng.toString());
            let waypoint = this.props.waypoints.filter((v)=>v.key==this.keyOfWaypointBeingDragged)[0];
            waypoint.latLng = newLatLng ;
            this.props.dispatch(routeDataActions.updateWaypointWithName(waypoint));
            this.keyOfWaypointBeingDragged = null;
          } else if(e.edge !== undefined) {
            // WAYPOINT INSERTED
            let newLatLng = this.polyline.getPath().getAt(e.edge+1)
            let waypoint = {
              latLng: newLatLng,
              name: `WPT ${this.props.waypoints.length+1}`,
              key: `${_.random(10000,99999)}-${Date.now()}`,
            }
            this.props.dispatch(routeDataActions.addWaypointWithName(waypoint, e.edge+1));
          }
        }, 1);
      });
      this.polyline.setMap(this.map);
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
        }
        this.props.dispatch(routeDataActions.addWaypointWithName(waypoint));
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
