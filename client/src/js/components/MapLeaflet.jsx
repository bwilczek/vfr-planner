import React from 'react'
import ReactDOM from 'react-dom'
import { Button } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { max, cloneDeep, isEqual, forEach, random, floor, find } from 'lodash'
import { Map, TileLayer } from 'react-leaflet'
import '../lib/Leaflet.Geodesic'
import 'leaflet-geometryutil'

import { updateUi } from '../actions/uiActions'
import { getAirspacesForFilters } from '../selectors/airspaces'
import { getNavigationData } from '../selectors/navigationData'
import { addWaypoint, addWaypointWithName, deleteWaypoint, updateWaypointWithName } from '../actions/flightPlanActions'
import { renameModalShow } from '../actions/modalsActions'
import * as format from '../lib/Formatter'
import { getIconForNavPointKind, getIconForWaypoint, createAirspaceRawPolygon } from '../lib/MapUtils'
import { standardizeLatLng } from '../lib/NavigationUtils'

@injectIntl
@connect(
  (state) => {
    return {
      navPoints: state.navPoints,
      airspaces: getAirspacesForFilters(state),
      ui: state.ui,
      waypoints: state.flightPlan.waypoints,
      navigationData: getNavigationData(state)
    }
  },
  (dispatch) => {
    return {
      addWaypointWithName: (waypoint, position = null) => {
        dispatch(addWaypointWithName(waypoint, position))
      },
      addWaypoint: (waypoint, position = null) => {
        dispatch(addWaypoint(waypoint, position))
      },
      updateUi: (fields) => {
        dispatch(updateUi(fields))
      },
      deleteWaypoint: (waypoint) => {
        dispatch(deleteWaypoint(waypoint))
      },
      renameModalShow: (waypoint) => {
        dispatch(renameModalShow(waypoint.key))
      },
      updateWaypointWithName: (waypoint) => {
        dispatch(updateWaypointWithName(waypoint))
      }
    }
  }
)
export default class MapLeaflet extends React.Component {

  constructor() {
    super()
    this.map = null
    this.poly = null
    this.infoWindow = null
    this.navPointMarkers = []
    this.wayPointMarkers = []
    this.potentialWayPointMarkers = []
    this.airspacePolygons = []
    this.minuteMarkers = []
    this.keyOfWaypointBeingDragged = null
    this.latLngOfMouseDown = null
  }

  componentDidMount() {
    this.initMap()
    this.plotAirspaces()
    this.plotNavPoints()
    this.plotRoute()
    this.plotMinutes()
  }

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(this.props.waypoints, prevProps.waypoints)) {
      this.plotRoute()
    }
    if (!isEqual(this.props.airspaces, prevProps.airspaces)) {
      this.plotAirspaces()
    }
    if (!isEqual(this.props.navPoints, prevProps.navPoints)) {
      this.plotNavPoints()
    }
    if (!isEqual(this.props.ui.mapCenter, prevProps.ui.mapCenter)) {
      this.map.setView(this.props.ui.mapCenter, this.props.ui.mapZoom)
    }
    if (
        max([this.props.navigationData.waypoints.length, prevProps.navigationData.waypoints.length]) > 1 &&
        (this.props.navigationData.waypoints.length !== prevProps.navigationData.waypoints.length ||
          !isEqual(this.props.navigationData.totalDistance, prevProps.navigationData.totalDistance)) ||
          !isEqual(this.props.navigationData.totalDuration, prevProps.navigationData.totalDuration)
      ) {
      // FIXME. This timeout is needed because of the calculation of the nav data for the newly inserted segment
      setTimeout(() => { this.plotMinutes() }, 300)
      // this.plotMinutes()
    }
  }

  onNavPointMarkerClick(marker) {
    let name = marker.navPoint.icao_code ? marker.navPoint.icao_code : marker.navPoint.name
    this.props.addWaypoint({
      name: name,
      radio: marker.navPoint.radio,
      elevation: marker.navPoint.elevation,
      declination: marker.navPoint.declination,
      latLng: marker.getLatLng(),
      coords: format.coords(marker.getLatLng()),
      key: `${random(10000, 99999)}-${Date.now()}`
    })
  }

  linkify(text) {
    var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(urlRegex, function(url) {
        return '<a href="' + url + '" target="_blank">' + url + '</a>';
    })
  }

  onNavPointMarkerRightClick(marker) {
    const { formatMessage } = this.props.intl
    let content = `
      <strong>${marker.navPoint.icao_code || ''} ${marker.navPoint.name}</strong><br />
      ${formatMessage({id: 'navPointKind_' + marker.navPoint.kind})}<br />`

    if (marker.navPoint.description) {
      let description = this.linkify(marker.navPoint.description)
      content += `<hr />${description}`
    }

    if (marker.navPoint.radio) {
      content += marker.navPoint.radio
    }

    const popup = L.popup()
    .setLatLng(marker.getLatLng())
    .setContent(content)
    .openOn(this.map);
  }

  onAirspaceRightClick(e) {
    let content = ''
    forEach(this.airspacePolygons, (poly) => {
      let bounds = poly.getBounds()
      if (!bounds.contains(e.latlng)) {
        return
      }
      content += `
      <strong>${poly.airspace.name}</strong><br />
      ${poly.airspace.level_min}ft - ${poly.airspace.level_max}ft<br />
      ${format.hour(poly.airspace.time_from)} - ${format.hour(poly.airspace.time_to)} UTC<br />
      ${poly.airspace.description}
      <hr />
      `
    })

    const popup = L.popup()
    .setLatLng(e.latlng)
    .setContent(content)
    .openOn(this.map);
  }

  plotNavPoints() {
    // CLEAR navPointMarkers
    forEach(this.navPointMarkers, (marker) => {
      marker.removeFrom(this.map);
    })
    this.navPointMarkers = []
    // PLOT navPointMarkers
    forEach(this.props.navPoints, (navPoint) => {
      this.navPointMarkers = [...this.navPointMarkers, this.createNavPointMarker(navPoint)]
    })
  }

  createNavPointMarker(navPoint) {
    const latLng = L.latLng(navPoint.lat, navPoint.lng)
    const icon = L.icon({iconUrl: getIconForNavPointKind(navPoint.kind), iconAnchor: [12, 12]})
    const newMarker = L.marker(latLng, {icon: icon, title: navPoint.name})
    newMarker.navPoint = navPoint
    newMarker.addTo(this.map)
    newMarker.on('click', this.onNavPointMarkerClick.bind(this, newMarker))
    newMarker.on('contextmenu', this.onNavPointMarkerRightClick.bind(this, newMarker))
    return newMarker
  }

  plotAirspaces() {
     // CLEAR airspacePolygons
     forEach(this.airspacePolygons, (polygon) => {
       polygon.removeFrom(this.map);
     })
     this.airspacePolygons = []
     // PLOT airspacePolygons
     forEach(this.props.airspaces, (airspace) => {
       switch (airspace.kind) {
         case 'ignore':
         case 'fis':
         case 'adiz':
           // TODO: make it a polyline
           break
         default:
           this.airspacePolygons.push(this.createAirspacePolygon(airspace))
       }
     })
   }

   createAirspacePolygon(airspace) {
     let polygon = createAirspaceRawPolygon(airspace)
     polygon.addTo(this.map);
     polygon.on('contextmenu',this.onAirspaceRightClick.bind(this))
     return polygon
   }

   createWayPointMarker(wayPoint, previousWayPoint) {
     const latLng = wayPoint.latLng
     //todo mondem new icon
     const icon = L.icon({iconUrl: getIconForWaypoint(), iconAnchor: [4, 4]})
     const newMarker = L.marker(latLng, {icon: icon, title: wayPoint.name, draggable: true})
     newMarker.wayPoint = wayPoint
     newMarker.addTo(this.map)
     newMarker.on('contextmenu', this.onWayPointRightClick.bind(this, newMarker))
     newMarker.on('moveend', this.onWayPointMoveEnd.bind(this, newMarker))
     if(previousWayPoint != null)
       this.createPotentialWayPointMarker(wayPoint, previousWayPoint)
     return newMarker
   }

   createPotentialWayPointMarker(wayPoint, previousWayPoint) {
     const { formatMessage } = this.props.intl
     let tooltip = formatMessage({id: 'potentialWayPointTooltip'})

     let navigationWayPoint = find(this.props.navigationData.waypoints, ['key', previousWayPoint.key])
     let heading = navigationWayPoint.rawCourse;

     let line = L.polyline([previousWayPoint.latLng, wayPoint.latLng])
     let distance = L.GeometryUtil.length(line)/2

     let latLng = L.GeometryUtil.destination(previousWayPoint.latLng, heading, distance)
     const icon = L.icon({iconUrl: getIconForWaypoint(), iconAnchor: [4, 4]})
     const newMarker = L.marker(latLng, {icon: icon, title: tooltip, draggable: true})
     newMarker.rightNeighbour = wayPoint
     newMarker.addTo(this.map)
    // // todo mondem
    // ////// newMarker.on('moveend', this.onPotentialWayPointMoveEnd.bind(this, newMarker))
     this.potentialWayPointMarkers = [...this.potentialWayPointMarkers, newMarker]
   }

   plotWayPoints() {
     // CLEAR wayPointMarkers
     forEach(this.wayPointMarkers, (marker) => {
       marker.removeFrom(this.map);
     })
     this.wayPointMarkers = []
     // CLEAR potentialWayPointMarkers
     forEach(this.potentialWayPointMarkers, (marker) => {
       marker.removeFrom(this.map);
     })
     this.potentialWayPointMarkers = []
     // PLOT wayPointMarkers
     let previousWayPoint = null
     forEach(this.props.waypoints, (wayPoint) => {
       this.wayPointMarkers = [...this.wayPointMarkers, this.createWayPointMarker(wayPoint, previousWayPoint)]
       previousWayPoint = wayPoint
     })
   }

  plotRoute() {
    this.poly.setLatLngs([this.props.waypoints.map((wp) => wp.latLng)])
    this.plotWayPoints();
  }

  onWayPointMoveEnd(marker) {
    let waypoint = cloneDeep(this.props.waypoints.filter((v) => v.key === marker.wayPoint.key)[0])
    waypoint.latLng = marker.getLatLng()
    this.props.updateWaypointWithName(waypoint)
        console.log('end of moving marker.waypoint.latLng po', marker.wayPoint.latLng)
  }

  onPotentialWayPointMoveEnd(marker) {
    console.log('new waypoint', marker)
    //let edge =
    // this.props.addWaypointWithName({
    //   name: `WPT ${this.props.waypoints.length + 1}`,
    //   latLng: marker.latlng,
    //   key: `${random(10000, 99999)}-${Date.now()}`
    // }, edge)
  }

  onWayPointRightClick(marker) {
    this.infoWindow.setContent(this.generateInfoWindowContent(this.infoWindow, marker.wayPoint))
    this.infoWindow.setLatLng(marker.getLatLng())
    this.infoWindow.openOn(this.map)
  }

  generateInfoWindowContent(iw, waypoint) {
    let a = document.createElement('div')
    const { formatMessage } = this.props.intl
    ReactDOM.render(
      <div>
        <div style={{marginBottom: '3px'}}>{waypoint.name}</div>
       <Button bsSize="xsmall" title={formatMessage({id: 'center'})} onClick={() => { this.props.updateUi({mapCenter: waypoint.latLng}) } }><FontAwesome name="crosshairs" /></Button>
       <Button bsSize="xsmall" title={formatMessage({id: 'rename'})} onClick={() => { this.props.renameModalShow(waypoint); iw.removeFrom(this.map) } }><FontAwesome name="edit" /></Button>
       <Button bsSize="xsmall" title={formatMessage({id: 'remove'})} onClick={() => { this.props.deleteWaypoint(waypoint); iw.removeFrom(this.map) } }><FontAwesome name="trash" /></Button>
      </div>
    , a)
    return a
  }

  plotMinutes() {
    forEach(this.minuteMarkers, (marker) => {
      marker.removeFrom(this.map)
    })
    this.minuteMarkers = []

    let counterCarryOver = 0
    let counter = 0
    let minuteCounter = 0
    let newMarkerLocation = null
    let oneSecondDistanceInMeters = null
    let firstInSegment = true
    let resetOnEachSegment = true
    forEach(this.props.navigationData.waypoints, (segment) => {
      if (!segment.rawHeading) {
        return
      }
      if (resetOnEachSegment) {
        counter = 0
        minuteCounter = 0
      } else {
        counter = counterCarryOver
      }
      firstInSegment = true
      oneSecondDistanceInMeters = segment.rawGroundSpeed * 1852.0 / 3600.0
      while (true) {
        if (firstInSegment && counter === 0) {
          counter += 60
          continue
        }
        if (counter > segment.rawSegmentDuration) {
          break
        }
        minuteCounter += 1

        newMarkerLocation = L.GeometryUtil.destination(segment.latLng, segment.rawCourse, counter * oneSecondDistanceInMeters);

        let bold = minuteCounter % 5 === 0
        let rotation = floor(segment.rawCourse + 90)
        let minuteSvg = "<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20'><line x1='10' y1='5' x2='10' y2='15' style='stroke:#F00;stroke-width:1;transform-origin:center;transform:rotate("+rotation+"deg)'/></svg>"
        let minuteSvgBold = "<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20'><line x1='10' y1='1' x2='10' y2='19' style='stroke:#F00;stroke-width:2;transform-origin:center;transform:rotate("+rotation+"deg)'/></svg>"
        let minuteIconUrl = encodeURI("data:image/svg+xml," + (bold ? minuteSvgBold: minuteSvg)).replace('#','%23');


        let minuteIcon = L.icon({iconUrl: minuteIconUrl, iconAnchor: [10, 10]})
        let newMarker = L.marker(newMarkerLocation, {title: `Minute: ${minuteCounter}`, icon: minuteIcon})
        newMarker.addTo(this.map)
        this.minuteMarkers.push(newMarker)

        firstInSegment = false
        counter += 60
      }
      counterCarryOver = counter - segment.rawSegmentDuration
    })
  }

  initMap() {
    const { formatMessage } = this.props.intl

    this.map = this.refs.leafletMap.leafletElement
    this.map.on('click', this.onMapClick.bind(this))
    this.map.setView(this.props.ui.mapCenter, this.props.ui.mapZoom)
    this.map.on('moveend', this.onMapIdle.bind(this))
    this.map.on('zoomend', this.onZoomChanged.bind(this))

    var openStreetMapLayer = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'})
    var esriWorldImageryLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'})
    this.map.addLayer(openStreetMapLayer)

    var baseMaps = {}
    baseMaps[formatMessage({id: 'layerMap'})] = openStreetMapLayer
    baseMaps[formatMessage({id: 'layerSatellite'})] = esriWorldImageryLayer

    L.control.layers(baseMaps).addTo(this.map);

    this.infoWindow = L.popup()

    this.poly = L.geodesic([this.props.waypoints.map((wp) => wp.latLng)], {color: '#ff0000'})
    this.poly.addTo(this.map)
  }

  onMapClick(e) {
    this.props.addWaypointWithName({
      name: `WPT ${this.props.waypoints.length + 1}`,
      latLng: e.latlng,
      key: `${random(10000, 99999)}-${Date.now()}`
    })
  }

  onMapIdle(e) {
    this.props.updateUi({mapCenter: {lat: this.map.getCenter().lat, lng: this.map.getCenter().lng}})
  }

  onZoomChanged(e) {
    this.props.updateUi({mapZoom: this.map.getZoom()})
  }

  render() {
    return (
      <Map ref="leafletMap">
      </Map>
    )
  }
}
