import React from 'react'

import { Link } from 'react-router'
import { Button, ButtonGroup, Dropdown, MenuItem } from 'react-bootstrap'
var FontAwesome = require('react-fontawesome')

import Auth from './Auth'

export default class Navigation extends React.Component {

  infoDropdown() {
    return (
      <Dropdown id="dropdown-settings-1" style={{verticalAlign: 'middle', marginLeft: '15px'}}>
        <Dropdown.Toggle style={{verticalAlign: 'middle'}}>
          <FontAwesome title="System information" size='2x' name="info-circle" />Info
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <MenuItem><Link to="/static/status">Status</Link></MenuItem>
          <MenuItem><Link to="/static/contact">Contact</Link></MenuItem>
          <MenuItem><Link to="/static/help">Help</Link></MenuItem>
        </Dropdown.Menu>
      </Dropdown>
    )
  }

  leftSideButtons() {
    return (
      <ButtonGroup>
        <Dropdown id="dropdown-settings-1" noCaret="true" style={{verticalAlign: 'middle', marginLeft: '15px'}}>
          <Dropdown.Toggle  noCaret="true" style={{verticalAlign: 'middle'}}>
            <FontAwesome title="System information" size='2x' name="info-circle" />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <MenuItem><Link to="/static/status">Status</Link></MenuItem>
            <MenuItem><Link to="/static/contact">Contact</Link></MenuItem>
            <MenuItem><Link to="/static/help">Help</Link></MenuItem>
          </Dropdown.Menu>
        </Dropdown>
        <Button style={{height: '43px'}}><FontAwesome title="Map content" size='2x' name="map" style={{verticalAlign: 'middle', marginRight: '5px'}}/>Map settings</Button>
        <Button style={{height: '43px'}}><FontAwesome title="Map content" size='2x' name="plane" style={{verticalAlign: 'middle', marginRight: '5px'}}/>Flight plan</Button>
      </ButtonGroup>
    )
  }

  render() {
    return (
      <div style={{marginBottom: '1px', borderBottom: '1px solid #000000', width: '100%', display: 'flex', justifyContent: 'space-between'}}>
        <div>
          <img src="img/lecimy_icon.png" />
          {this.leftSideButtons()}
        </div>
        <div style={{lineHeight: '52px'}}>
          <Auth />
        </div>
      </div>
    );
  } // render2
}
// <FontAwesome title="System information" size='3x' name="info-circle" style={{verticalAlign: 'middle', cursor: 'pointer', marginLeft: '15px'}} />
