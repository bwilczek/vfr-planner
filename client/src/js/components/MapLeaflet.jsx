import React from 'react'
import ReactDOM from 'react-dom'
import { Button } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { max, cloneDeep, isEqual, forEach, random, floor, find, findIndex } from 'lodash'
import { Map, TileLayer } from 'react-leaflet'
import '../lib/Leaflet.Geodesic'
import '../lib/Leaflet.PointInPolygon'
import '../lib/leaflet.rotatedMarker'
import '../vendor/Leaflet.fullscreen.min.js'
import 'leaflet-geometryutil'

import { updateUi } from '../actions/uiActions'
import { getAirspacesForFilters } from '../selectors/airspaces'
import { getNavigationData } from '../selectors/navigationData'
import { addWaypoint, addWaypointWithName, deleteWaypoint, updateWaypointWithName } from '../actions/flightPlanActions'
import { renameModalShow } from '../actions/modalsActions'
import * as format from '../lib/Formatter'
import { getIconForNavPointKind, getIconForWaypoint, createAirspaceRawPolygon, getIconForPotentialWaypoint, getIconForWaypointMouseOver, getIconForPotentialWaypointMouseOver, getIconForFlightMode } from '../lib/MapUtils'

@injectIntl
@connect(
  (state) => {
    return {
      ui: state.ui,
      flightMode: state.ui.flightMode,
      airspaces: getAirspacesForFilters(state),
      navPoints: state.navPoints,
      waypoints: state.flightPlan.waypoints,
      navigationData: getNavigationData(state)
    }
  },
  (dispatch) => {
    return {
      updateUi: (fields) => {
        dispatch(updateUi(fields))
      },
      addWaypointWithName: (waypoint, position = null) => {
        dispatch(addWaypointWithName(waypoint, position))
      },
      addWaypoint: (waypoint, position = null) => {
        dispatch(addWaypoint(waypoint, position))
      },
      updateWaypointWithName: (waypoint) => {
        dispatch(updateWaypointWithName(waypoint))
      },
      deleteWaypoint: (waypoint) => {
        dispatch(deleteWaypoint(waypoint))
      },
      renameModalShow: (waypoint) => {
        dispatch(renameModalShow(waypoint.key))
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
    this.geolocationId = null;
    this.flightModeMarker = null;
    this.flightModePrevLatLng = null;
  }

  componentDidMount() {
    this.initMap()
    this.plotAirspaces()
    this.plotNavPoints()
    this.plotRoute()
    this.plotMinutes()
    this.plotFlightMode();
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
      this.plotMinutes()
    }
    if (!isEqual(this.props.flightMode, prevProps.flightMode)) {
      this.plotFlightMode();
    }
  }

  //FLIGHT MODE
  plotFlightMode(){
    if (this.props.flightMode) {
      this.geolocationId = navigator.geolocation.watchPosition(this.createFlightModeMarker.bind(this), (e) => console.log(e))
    } else {
      if (this.flightModeMarker) {
        this.flightModeMarker.removeFrom(this.map)
      }
      navigator.geolocation.clearWatch(this.geolocationId)
    }
  }

  createFlightModeMarker(position) {
    if (this.flightModeMarker) {
      this.flightModeMarker.removeFrom(this.map)
      this.flightModeMarker = null
    }
    const { formatMessage } = this.props.intl
    const latLng = L.latLng(position.coords.latitude, position.coords.longitude)
    const heading = this.flightModePrevLatLng ? L.GeometryUtil.bearing(this.flightModePrevLatLng, latLng) : 0
    const icon = L.icon({iconUrl: getIconForFlightMode(), iconSize: 24, iconAnchor: [12, 12]})
    const newMarker = L.marker(latLng, {icon: icon, rotationAngle: heading, title: formatMessage({id: 'flightModeMarker'})})

    this.flightModePrevLatLng = latLng
    this.flightModeMarker = newMarker
    this.flightModeMarker.addTo(this.map)
  }

  //NAVPOINTS
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

  onNavPointMarkerRightClick(marker) {
    const { formatMessage } = this.props.intl
    let content = `
      <strong>${marker.navPoint.icao_code || ''} ${marker.navPoint.name}</strong><br />
      ${formatMessage({id: 'navPointKind_' + marker.navPoint.kind})}<br />`

    if (marker.navPoint.description) {
      let description = format.linkify(marker.navPoint.description)
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

  //AIRSPACE
  onAirspaceRightClick(e) {
    let content = ''
    forEach(this.airspacePolygons, (poly) => {
      if (!poly.contains(e.latlng)) {
        return
      }
      content += `<strong>${poly.airspace.name}</strong><br />`
      content += `${poly.airspace.level_min}ft - ${poly.airspace.level_max}ft<br />`
      if (poly.airspace.time_from) {
        content += `${format.hour(poly.airspace.time_from)} - ${format.hour(poly.airspace.time_to)} UTC<br />`
      }
      content += `${poly.airspace.description}<hr />`
    })

    const popup = L.popup()
    .setLatLng(e.latlng)
    .setContent(content)
    .openOn(this.map);
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

   //WAYPOINTS
   createWayPointMarker(wayPoint, previousWayPoint) {
     const latLng = wayPoint.latLng
     const icon = L.icon({iconUrl: getIconForWaypoint(), iconAnchor: [5, 5]})
     const newMarker = L.marker(latLng, {icon: icon, title: wayPoint.name, draggable: true, riseOnHover: true, zIndexOffset: 11})
     newMarker.wayPoint = wayPoint
     newMarker.addTo(this.map)
     newMarker.on('contextmenu', this.onWayPointRightClick.bind(this, newMarker))
     newMarker.on('moveend', this.onWayPointMoveEnd.bind(this, newMarker))
     newMarker.on('mouseover', this.setWayPointOnMouseOverIcon.bind(this, newMarker))
     newMarker.on('mouseout', this.setWayPointOnRegularIcon.bind(this, newMarker))
     if(previousWayPoint != null)
       this.createPotentialWayPointMarker(wayPoint, previousWayPoint)
     return newMarker
   }

   setWayPointOnMouseOverIcon(marker) {
     marker._icon.src = getIconForWaypointMouseOver()
   }

   setWayPointOnRegularIcon(marker) {
     marker._icon.src = getIconForWaypoint()
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

  onWayPointMoveEnd(marker) {
    let waypoint = cloneDeep(this.props.waypoints.filter((v) => v.key === marker.wayPoint.key)[0])
    waypoint.latLng = marker.getLatLng()
    this.props.updateWaypointWithName(waypoint)
  }

  onWayPointRightClick(marker) {
    this.infoWindow.setContent(this.generateInfoWindowContent(this.infoWindow, marker.wayPoint))
    this.infoWindow.setLatLng(marker.getLatLng())
    this.infoWindow.openOn(this.map)
  }

   //POTENTIAL WAYPOINTS
   setPotentialWayPointOnMouseOverIcon(marker) {
     marker._icon.src = getIconForPotentialWaypointMouseOver()
   }

   setPotentialWayPointOnRegularIcon(marker) {
     marker._icon.src = getIconForPotentialWaypoint()
   }

   createPotentialWayPointMarker(wayPoint, previousWayPoint) {
     const { formatMessage } = this.props.intl
     let tooltip = formatMessage({id: 'potentialWayPointTooltip'})

     let navigationWayPoint = find(this.props.navigationData.waypoints, ['key', previousWayPoint.key])
     let heading = navigationWayPoint.rawCourse;

     let line = L.polyline([previousWayPoint.latLng, wayPoint.latLng])
     let distance = L.GeometryUtil.length(line)/2

     let latLng = L.GeometryUtil.destination(previousWayPoint.latLng, heading, distance)
     const icon = L.icon({iconUrl: getIconForPotentialWaypoint(), iconAnchor: [5, 5]})
     const newMarker = L.marker(latLng, {icon: icon, title: tooltip, draggable: true, riseOnHover: true, zIndexOffset: 10})
     newMarker.rightNeighbour = wayPoint
     newMarker.addTo(this.map)
     newMarker.on('moveend', this.onPotentialWayPointMoveEnd.bind(this, newMarker))
     newMarker.on('mouseover', this.setPotentialWayPointOnMouseOverIcon.bind(this, newMarker))
     newMarker.on('mouseout', this.setPotentialWayPointOnRegularIcon.bind(this, newMarker))
     this.potentialWayPointMarkers = [...this.potentialWayPointMarkers, newMarker]
   }

  onPotentialWayPointMoveEnd(marker) {
    let edge = findIndex(this.props.navigationData.waypoints, ['key', marker.rightNeighbour.key])
    let waypoint = {
      latLng: marker.getLatLng(),
      name: `WPT ${this.props.waypoints.length + 1}`,
      key: `${random(10000, 99999)}-${Date.now()}`,
    }
    this.props.addWaypointWithName(waypoint, edge)
  }

  //ROUTE
  plotRoute() {
    this.poly.setLatLngs([this.props.waypoints.map((wp) => wp.latLng)])
    this.plotWayPoints();
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
    let strokeWidth = null
    let path = null
    let pathDescription = null
    let style = null
    let svg = null
    let anchor = null
    let size = null
    let bold = false
    let rotation = null
    let minuteIcon = null
    let newMarker = null
    const stroke = '#F00'

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

        bold = minuteCounter % 5 === 0
        rotation = floor(segment.rawCourse + 90)

        if(bold) {
          strokeWidth = 2
          pathDescription = 'M 10,0 10,20 z'
          anchor = 10
          size = 20
        } else {
          strokeWidth = 1
          pathDescription = 'M 5,0 5,10 z'
          anchor = 6
          size = 10
        }

        path = '<path class="lecimy-icon-path" d="' + pathDescription +
            '" stroke-width="' + strokeWidth + '" stroke="' + stroke +
            '" style="transform-origin:center;transform:rotate('+rotation+'deg)"/>'
        style = "width:" + size + "px; height:" + size + "px;"
        svg = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="lecimy-icon-svg" style="' + style + '">' + path + '</svg>'

        minuteIcon = L.divIcon({className: 'lecimy-icon', html: svg, iconAnchor: [anchor, anchor], iconSize: L.point(size,size)})
        newMarker = L.marker(newMarkerLocation, {title: `Minute: ${minuteCounter}`, icon: minuteIcon})
        newMarker.addTo(this.map)
        this.minuteMarkers.push(newMarker)

        firstInSegment = false
        counter += 60
      }
      counterCarryOver = counter - segment.rawSegmentDuration
    })
  }

  //MISCELLANEOUS
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

  initMap() {
    const { formatMessage } = this.props.intl

    this.map = this.refs.leafletMap.leafletElement
    this.map.on('click', this.onMapClick.bind(this))
    this.map.setView(this.props.ui.mapCenter, this.props.ui.mapZoom)
    this.map.on('moveend', this.onMapIdle.bind(this))
    this.map.on('zoomend', this.onZoomChanged.bind(this))
    this.map.addControl(new L.Control.Fullscreen({
      title: {
          'false': formatMessage({id: 'fullScreenOn'}),
          'true': formatMessage({id: 'fullScreenOff'})
      }
    }));

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
