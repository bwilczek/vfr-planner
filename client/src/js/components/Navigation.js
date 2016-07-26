import React from 'react'
import ReactDOM from 'react-dom'

import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Modal, Button, ButtonGroup, Dropdown, MenuItem } from 'react-bootstrap'
const FontAwesome = require('react-fontawesome')

import * as modalActions from '../actions/modalActions'

import Auth from './Auth'

@connect((store) => {
  // don't need any state props here - only access to dispatch method
  return {}
})
export default class Navigation extends React.Component {

  leftSideButtons() {
    // <Link to="/static/status">Status</Link>
    return (
      <ButtonGroup>
        <Dropdown id="dropdown-settings-1" noCaret="true" style={{verticalAlign: 'middle', marginLeft: '15px'}}>
          <Dropdown.Toggle  noCaret="true" style={{verticalAlign: 'middle'}}>
            <FontAwesome title="System information" size='2x' name="info-circle" />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <MenuItem>Status</MenuItem>
            <MenuItem onClick={() => {this.props.dispatch(modalActions.showContact())}}>Contact</MenuItem>
            <MenuItem>Help</MenuItem>
          </Dropdown.Menu>
        </Dropdown>
        <Button style={{height: '43px'}}><FontAwesome title="Configure objects displayed on the map" size='2x' name="map" style={{verticalAlign: 'middle', marginRight: '5px'}}/>Map settings</Button>
        <Button style={{height: '43px'}}><FontAwesome title="Provide flight details" size='2x' name="plane" style={{verticalAlign: 'middle', marginRight: '5px'}}/>Flight plan</Button>
        <Button style={{height: '43px'}}><FontAwesome title="Print operational flight plan" size='2x' name="print" style={{verticalAlign: 'middle', marginRight: '5px'}}/><strong>Print</strong></Button>
      </ButtonGroup>
    )
  }

  render() {
    return (
      <div style={{marginBottom: '1px', borderBottom: '1px solid #000000', width: '100%', display: 'flex', justifyContent: 'space-between'}}>
        <div>
          <img src="img/lecimy_icon.png" />
          <span ref="modalNode" />
          {this.leftSideButtons()}
        </div>
        <div style={{marginTop: '5px'}}>
          <Auth />
        </div>
      </div>
    );
  }
}
