import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { max, cloneDeep, isEqual, forEach, random } from 'lodash'
import { injectIntl } from 'react-intl'

import FontAwesome from 'react-fontawesome'
import { Button } from 'react-bootstrap'

import { updateUi } from '../actions/uiActions'
import { addWaypoint, addWaypointWithName, updateWaypointWithName, deleteWaypoint } from '../actions/flightPlanActions'
import { getNavigationData } from '../selectors/navigationData'
import { renameModalShow } from '../actions/modalsActions'
import { getIconForNavPointKind, createAirspaceRawPolygon } from '../lib/MapUtils'
import { getAirspacesForFilters } from '../selectors/airspaces'
import * as format from '../lib/Formatter'
import { sanitizeDegrees, standardizeLatLng } from '../lib/NavigationUtils'

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
      updateUi: (fields) => {
        dispatch(updateUi(fields))
      },
      addWaypoint: (waypoint, position = null) => {
        dispatch(addWaypoint(waypoint, position))
      },
      addWaypointWithName: (waypoint, position = null) => {
        dispatch(addWaypointWithName(waypoint, position))
      },
      deleteWaypoint: (waypoint) => {
        dispatch(deleteWaypoint(waypoint))
      },
      updateWaypointWithName: (waypoint) => {
        dispatch(updateWaypointWithName(waypoint))
      },
      renameModalShow: (waypoint) => {
        dispatch(renameModalShow(waypoint.key))
      }
    }
  }
)
export default class Map extends React.Component {

  constructor() {
    super()
    this.initMap = this.initMap.bind(this)
    this.map = null
    this.poly = null
    this.infoWindow = null
    this.navPointMarkers = []
    this.airspacePolygons = []
    this.minuteMarkers = []
    this.keyOfWaypointBeingDragged = null
    this.latLngOfMouseDown = null
  }

  defaultMapSettings() {
    return {
      center: this.props.ui.mapCenter,
      zoom: this.props.ui.mapZoom,
      draggableCursor: 'crosshair'
    }
  }

  componentDidMount() {
    this.initMap()
    this.plotAirspaces()
    this.plotNavPoints()
    this.plotMinutes()
  }

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(this.props.navPoints, prevProps.navPoints)) {
      this.plotNavPoints()
    }
    if (!isEqual(this.props.airspaces, prevProps.airspaces)) {
      this.plotAirspaces()
    }
    if (!isEqual(this.props.waypoints, prevProps.waypoints)) {
      this.plotRoute()
    }
    if (!isEqual(this.props.ui.mapCenter, prevProps.ui.mapCenter)) {
      this.map.setCenter(this.props.ui.mapCenter)
    }
    if (
        max([this.props.navigationData.waypoints.length, prevProps.navigationData.waypoints.length]) > 1 &&
        ( this.props.navigationData.waypoints.length != prevProps.navigationData.waypoints.length ||
          !isEqual(this.props.navigationData.totalDistance, prevProps.navigationData.totalDistance) )
      ) {
      // FIXME. This timeout is needed because of the calculation of the nav data for the newly inserted segment
      setTimeout(() => {this.plotMinutes()}, 300)
      // this.plotMinutes()
    }
  }

  onMarkerClick(marker) {
    let name = marker.navPoint.icao_code ? marker.navPoint.icao_code : marker.navPoint.name
    this.props.addWaypoint({
      name: name,
      radio: marker.navPoint.radio,
      elevation: marker.navPoint.elevation,
      declination: marker.navPoint.declination,
      latLng: marker.position,
      coords: format.coords(marker.position),
      key: `${random(10000, 99999)}-${Date.now()}`
    })
  }

  onMarkerRightClick(marker) {
    const { formatMessage } = this.props.intl
    let content = `
      <strong>${marker.navPoint.name}</strong><br />
      ${formatMessage({id: 'navPointKind_' + marker.navPoint.kind})}<br />`

    if (marker.navPoint.description) {
      content += `<hr />${marker.navPoint.description}`
    }

    const infowindow = new google.maps.InfoWindow({ content })
    infowindow.open(this.map, marker)
  }

  onAirspaceRightClick(e) {
    let content = ''
    forEach(this.airspacePolygons, (poly) => {
      if (!google.maps.geometry.poly.containsLocation(e.latLng, poly)) {
        return
      }
      content += `
      <strong>${poly.airspace.name}</strong><br />
      ${poly.airspace.level_min}ft - ${poly.airspace.level_max}ft<br />
      ${poly.airspace.description}
      <hr />
      `
    })
    const infowindow = new google.maps.InfoWindow({ content })
    infowindow.setPosition(e.latLng)
    infowindow.open(this.map)
  }

  onMapClick(e) {
    this.props.addWaypointWithName({
      name: `WPT ${this.props.waypoints.length + 1}`,
      latLng: e.latLng,
      key: `${random(10000, 99999)}-${Date.now()}`
    })
  }

  onMapIdle(e) {
    this.props.updateUi({mapCenter: {lat: this.map.getCenter().lat(), lng: this.map.getCenter().lng()}})
  }

  onPolyMouseDown(e) {
    this.latLngOfMouseDown = e.latLng
    if (e.vertex !== undefined) {
      this.keyOfWaypointBeingDragged = this.props.waypoints[e.vertex].key
    }
  }

  onPolyMouseUp(e) {
    setTimeout(() => {
      // WAYPOINT MOVED/CLICKED
      if (e.vertex !== undefined) {
        let newLatLng = this.poly.getPath().getAt(e.vertex)
        if (e.latLng === this.latLngOfMouseDown) {
          // WAYPOINT CLICKED
          this.infoWindow.setContent(this.generateInfoWindowContent(this.infoWindow, this.props.waypoints[e.vertex]))
          this.infoWindow.setPosition(newLatLng)
          this.infoWindow.open(this.map)
          e.stop()
        } else {
          // WAYPOINT DRAGGED
          let waypoint = cloneDeep(this.props.waypoints.filter((v) => v.key === this.keyOfWaypointBeingDragged)[0])
          waypoint.latLng = newLatLng
          this.props.updateWaypointWithName(waypoint)
          this.keyOfWaypointBeingDragged = null
        }
      } else if (e.edge !== undefined) {
        // WAYPOINT INSERTED
        if (this.latLngOfMouseDown !== e.latLng) {
          let newLatLng = this.poly.getPath().getAt(e.edge + 1)
          let waypoint = {
            latLng: newLatLng,
            name: `WPT ${this.props.waypoints.length + 1}`,
            key: `${random(10000, 99999)}-${Date.now()}`,
          }
          this.props.addWaypointWithName(waypoint, e.edge + 1)
        }
      }
      this.latLngOfMouseDown = null
    }, 0)
  }

  onZoomChanged(e) {
    this.props.updateUi({mapZoom: this.map.getZoom()})
  }

  generateInfoWindowContent(iw, waypoint) {
    let a = document.createElement('div')
    const { formatMessage } = this.props.intl
    ReactDOM.render(
      <div>
        <div style={{marginBottom: '3px'}}>{waypoint.name}</div>
        <Button bsSize="xsmall" title={formatMessage({id: 'center'})} onClick={() => { this.props.updateUi({mapCenter: waypoint.latLng}) } }><FontAwesome name="crosshairs" /></Button>
        <Button bsSize="xsmall" title={formatMessage({id: 'rename'})} onClick={() => { this.props.renameModalShow(waypoint); iw.close() } }><FontAwesome name="edit" /></Button>
        <Button bsSize="xsmall" title={formatMessage({id: 'remove'})} onClick={() => { this.props.deleteWaypoint(waypoint); iw.close() } }><FontAwesome name="trash" /></Button>
      </div>
    , a)
    return a
  }

  createNavPointMarker(navPoint) {
    const latLng = new google.maps.LatLng(navPoint.lat, navPoint.lng)
    const newMarker = new google.maps.Marker({
      position: latLng,
      map: this.map,
      title: navPoint.name,
      navPoint: navPoint,
      icon: {
        url: getIconForNavPointKind(navPoint.kind),
        anchor: new google.maps.Point(12, 12)
      }
    })
    newMarker.addListener('rightclick', this.onMarkerRightClick.bind(this, newMarker))
    newMarker.addListener('click', this.onMarkerClick.bind(this, newMarker))
    return newMarker
  }

  createAirspacePolygon(airspace) {
    let polygon = createAirspaceRawPolygon(airspace)
    polygon.addListener('click', (e) => { google.maps.event.trigger(this.map, 'click', e) })
    polygon.addListener('rightclick', this.onAirspaceRightClick.bind(this))
    polygon.setMap(this.map)
    return polygon
  }

  plotRoute() {
    this.poly.setPath(this.props.waypoints.map((wp) => wp.latLng))
  }

  plotMinutes() {
    forEach(this.minuteMarkers, (marker) => {
      marker.setMap(null)
    })
    this.minuteMarkers = []

    console.log('minutes')
    let counterCarryOver = 0
    let counter = 0
    let newMarkerLocation = null
    let oneSecondDistanceInMeters = null
    let firstInSegment = true
    forEach(this.props.navigationData.waypoints, (segment) => {
      if (!segment.rawHeading) {
        return
      }
      counter = counterCarryOver // or zero: this should be customizable
      firstInSegment = true
      oneSecondDistanceInMeters = segment.rawGroundSpeed * 1852.0 / 3660.0
      console.log('segment')
      console.log(segment.rawSegmentDuration)
      console.log(counterCarryOver)
      console.log('while')
      while(true) {
        console.log(counter)
        if(firstInSegment && counter == 0) {
          counter += 60
          continue
        }
        if (counter > segment.rawSegmentDuration) {
          break
        }
        newMarkerLocation = google.maps.geometry.spherical.computeOffset(standardizeLatLng(segment.latLng), counter * oneSecondDistanceInMeters, segment.rawCourse)

        let bold = (this.minuteMarkers.length+1) % 5 == 0

        let minuteSvg = {
          path: bold ? 'M 0,-9 0,9 z' : 'M 0,-5 0,5 z',
          strokeColor: '#F00',
          strokeWeight: bold ? 2 : 1,
          fillColor: '#F00',
          fillOpacity: 1,
          rotation: segment.rawCourse + 90
        }

        let newMarker = new google.maps.Marker({
          position: newMarkerLocation,
          map: this.map,
          title: `Minute: ${this.minuteMarkers.length + 1}`,
          icon: minuteSvg
        })
        console.log('Add minute marker')
        this.minuteMarkers.push(newMarker)
        firstInSegment = false
        counter += 60
      }
      // FIXME: include the initial carryOver for the segment (counter has it)
      // counterCarryOver = 60 - (segment.rawSegmentDuration % 60)
      counterCarryOver = counter - segment.rawSegmentDuration
    })
  }

  plotNavPoints() {
    // CLEAR navPointMarkers
    forEach(this.navPointMarkers, (marker) => {
      marker.setMap(null)
    })
    this.navPointMarkers = []
    // PLOT navPointMarkers
    forEach(this.props.navPoints, (navPoint) => {
      this.navPointMarkers = [...this.navPointMarkers, this.createNavPointMarker(navPoint)]
    })
  }

  plotAirspaces() {
    // CLEAR airspacePolygons
    forEach(this.airspacePolygons, (polygon) => {
      polygon.setMap(null)
    })
    this.airspacePolygons = []
    // PLOT airspacePolygons
    forEach(this.props.airspaces, (airspace) => {
      switch (airspace.kind) {
        case 'fis':
        case 'adiz':
          // TODO: make it a polyline
          break
        default:
          this.airspacePolygons.push(this.createAirspacePolygon(airspace))
      }
    })
  }

  initMap() {
    this.map = new google.maps.Map(this.refs.map, this.defaultMapSettings())
    this.map.addListener('click', this.onMapClick.bind(this))
    this.map.addListener('idle', this.onMapIdle.bind(this))
    this.map.addListener('zoom_changed', this.onZoomChanged.bind(this))
    this.infoWindow = new google.maps.InfoWindow()
    this.poly = new google.maps.Polyline({
      map: this.map,
      path: this.props.waypoints.map((wp) => wp.latLng),
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 3,
      geodesic: true,
      editable: true,
      suppressUndo: true,
      clickable: false,
    })
    this.poly.addListener('mousedown', this.onPolyMouseDown.bind(this))
    this.poly.addListener('mouseup', this.onPolyMouseUp.bind(this))
  }

  render() {
    return (
      <div ref="map" id="map">
        Mapa!
      </div>
    )
  }
}
