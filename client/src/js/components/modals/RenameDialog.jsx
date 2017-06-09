import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { find } from 'lodash'
import { FormControl, Modal, Button, ButtonGroup, Dropdown, MenuItem } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import { injectIntl, FormattedMessage } from 'react-intl'

import { renameModalHide } from '../../actions/modalsActions'
import { updateWaypoint } from '../../actions/flightPlanActions'

@injectIntl
@connect(
  (state) => {
    return {
      waypoint: find(state.flightPlan.waypoints, ['key', state.modals.waypointToRenameKey])
    }
  },
  (dispatch) => {
    return {
      renameModalHide: () => {
        dispatch(renameModalHide())
      },
      updateWaypoint: (waypoint) => {
        dispatch(updateWaypoint(waypoint))
        dispatch(renameModalHide())
      }
    }
  }
)
export default class RenameDialog extends React.Component {

  constructor() {
    super()
    this.currentValue = ''
  }

  render() {
    if(this.props.waypoint === undefined) {
      return null;
    }

    return (
      <Modal show={this.props.waypoint !== undefined} onEntered={()=>{ReactDOM.findDOMNode(this.refs.renameInput).focus()}} onHide={this.props.renameModalHide}>
        <Modal.Header closeButton>
          <Modal.Title><FormattedMessage id="renameHeader" values={{name: this.props.waypoint.name}} /></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormControl
            type="text"
            placeholder={this.props.waypoint.name}
            ref="renameInput"
            onChange={(e)=>{this.currentValue = e.target.value}}
            onKeyPress={(e)=>{{if(e.charCode==13) this.props.updateWaypoint({...this.props.waypoint, name: this.currentValue}) }}}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="danger" onClick={this.props.renameModalHide}><FormattedMessage id="cancel" /></Button>
          <Button bsStyle="success" onClick={() => {this.props.updateWaypoint({...this.props.waypoint, name: this.currentValue}) }}><FormattedMessage id="save" /></Button>
        </Modal.Footer>
      </Modal>
    );
  }

}
