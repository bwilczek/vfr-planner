import axios from 'axios'
import { browserHistory } from 'react-router'
import { actions as toastrActions } from 'react-redux-toastr'

import * as toastrUtils from '../lib/ToastrUtils'
import { updateUi } from './uiActions'

export function updateFlightPlan(fields) {
  return {
    type: 'UPDATE_FLIGHT_PLAN',
    payload: fields
  }
}

export function addWaypoint(waypoint, position = null) {
  return {
    type: 'ADD_WAYPOINT',
    payload: { waypoint, position }
  }
}

export function updateWaypoint(waypoint) {
  return {
    type: 'UPDATE_WAYPOINT',
    payload: waypoint
  }
}

export function deleteWaypoint(waypoint) {
  return {
    type: 'DELETE_WAYPOINT',
    payload: waypoint
  }
}

export function reorderWaypoints(newWaypoints) {
  return {
    type: 'REORDER_WAYPOINTS',
    payload: newWaypoints,
  }
}

export function addWaypointWithName(waypoint, position = null) {
  return (dispatch) => {
    dispatch(addWaypoint(waypoint, position))
    dispatch(reverseGeocode(waypoint))
  }
}

export function updateWaypointWithName(waypoint) {
  return (dispatch) => {
    dispatch(updateWaypoint(waypoint))
    dispatch(reverseGeocode(waypoint))
  }
}

export function reverseGeocode(waypoint) {
  return {
    type: 'WAYPOINT_REVERSE_GEOCODE',
    payload: axios.get(`/api/nav_points/find?lat=${waypoint.latLng.lat()}&lng=${waypoint.latLng.lng()}&key=${waypoint.key}`),
  }
}

export function saveFlightPlan(data, title, message) {
  return (dispatch) => {
    dispatch(toastrActions.add(toastrUtils.configForSaveFlightPlan(title, message)))
    axios.post('/api/plans', {plan: data}).then(
      (response) => {
        console.log(response.data)
        dispatch(toastrActions.remove('backgroundActionSaveFlightPlan'))
        dispatch(updateFlightPlan(response.data))
        browserHistory.push(`/plan-${response.data.id}`)
      },
      (error) => {
        dispatch({type: 'XHR_REQUEST_FAILED', payload: error})
      }
    )
  }
}

export function fetchFlightPlan(planId) {
  return (dispatch) => {
    axios.get(`/api/plans/${planId}`).then(
      (response) => {
        dispatch(updateFlightPlan(response.data))
        dispatch(updateUi({ mapCenter: { lat: response.data.waypoints[0].latLng.lat, lng: response.data.waypoints[0].latLng.lng } }))
      },
      (error) => {
        // TODO: handle 401 Unauthorized
        dispatch({type: 'XHR_REQUEST_FAILED', payload: error})
      }
    )
  }
}

export function fetchFlightPlans() {
  return {
    type: 'FETCH_FLIGHT_PLANS',
    payload: axios.get('/api/plans')
  }
}
