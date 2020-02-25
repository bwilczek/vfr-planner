import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { random } from 'lodash'

import { Modal, Button, ControlLabel, FormGroup, FormControl } from 'react-bootstrap'
import { AsyncTypeahead } from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import { injectIntl, FormattedMessage } from 'react-intl'

import { appendWaypointModalHide } from '../../actions/modalsActions'
import { addWaypoint, suggestNavPoints } from '../../actions/flightPlanActions'
import * as format from '../../lib/Formatter'

@injectIntl
@connect(
  (state) => {
    return {
      dialogOpen: state.modals.appendWaypointOpen,
      suggestedWaypoints: state.flightPlan.waypointsSuggestList,
      waypointsSuggestListLoading: state.flightPlan.waypointsSuggestListLoading
    }
  },
  (dispatch) => {
    return {
      closeDialog: () => {
        dispatch(appendWaypointModalHide())
      },
      suggestNavPoints: (phrase) => {
        dispatch(suggestNavPoints(phrase))
      },
      addWaypoint: (waypoint) => {
        const latLng = L.latLng(waypoint.lat, waypoint.lng)
        dispatch(
          addWaypoint({
            name: waypoint.name,
            radio: waypoint.radio,
            elevation: waypoint.elevation,
            declination: waypoint.declination,
            latLng: latLng,
            coords: format.coords(latLng),
            key: `${random(10000, 99999)}-${Date.now()}`
          })
        )
      }      
    }
  }
)
export default class AppendWaypointDialog extends React.Component {

  render() {
    return (
      <Modal show={this.props.dialogOpen} onHide={this.props.closeDialog} onEntered={() => { this.refs.searchPhraseInput._instance.focus() }}>
        <Modal.Header>
          <Modal.Title><FormattedMessage id="appendWaypointModalTitle" /></Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <AsyncTypeahead
            id='searchPhraseInput'
            ref='searchPhraseInput'
            minLength={3}
            isLoading={this.props.waypointsSuggestListLoading}
            onSearch={(query) => {
              this.props.suggestNavPoints(query)
            }}
            onChange={(selected) => {
              if (!selected) {
                return
              }
              this.props.addWaypoint(selected[0])
              this.refs.searchPhraseInput._instance.clear()
            }}
            options={this.props.suggestedWaypoints}
            labelKey={option => `${option.name}`}
          />

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.closeDialog}><FormattedMessage id="close" /></Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
