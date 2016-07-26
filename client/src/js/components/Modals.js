import React from 'react'
import ReactDOM from 'react-dom'

import { FormControl, Modal, Button, ButtonGroup, Dropdown, MenuItem } from 'react-bootstrap'
var FontAwesome = require('react-fontawesome')
import { connect } from 'react-redux'

import * as modalActions from '../actions/modalActions'
import * as routeDataActions from '../actions/routeDataActions'

@connect((store) => {
  return _.cloneDeep(store.modal)
})
export default class Modals extends React.Component {

  render() {

    let hideContact = () => {this.props.dispatch(modalActions.hideContact())}

    let hideRename = () => {this.props.dispatch(modalActions.hideRename())}
    let actionRename = (waypoint) => {this.props.dispatch(routeDataActions.updateWaypoint(waypoint))}
    let handleActionRename = () => {
      if(this.props.waypoint.name.length > 0) {
        actionRename(this.props.waypoint)
        hideRename()
      }
    }

    return (
      <span>
        <Modal show={this.props.showContact} onHide={hideContact} bsSize="large">
          <Modal.Header closeButton>
            <Modal.Title>Contact information</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            In case of any questions please contact me at kontakt [at] lecimy [dot] org
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={hideContact}>Close</Button>
          </Modal.Footer>
        </Modal>

        <Modal show={this.props.showRename} onEntered={()=>{ReactDOM.findDOMNode(this.refs.renameInput).focus()}} onHide={hideRename}>
          <Modal.Header closeButton>
            <Modal.Title>Rename waypoint "{this.props.waypoint.name}" to</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormControl
              type="text"
              placeholder={this.props.waypoint.name}
              ref="renameInput"
              onChange={(e)=>{this.props.waypoint.name=e.target.value}}
              onKeyPress={(e)=>{{if(e.charCode==13) handleActionRename() }}}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="danger" onClick={hideRename}>Cancel</Button>
            <Button bsStyle="success" onClick={handleActionRename}>Save</Button>
          </Modal.Footer>
        </Modal>

      </span>
    )
  }
}
