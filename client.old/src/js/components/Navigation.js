import React from 'react'
import ReactDOM from 'react-dom'
import Rcslider from 'rc-slider'

import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Modal, Button, ButtonGroup, Dropdown, MenuItem } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'

import * as modalActions from '../actions/modalActions'
import * as routeDataActions from '../actions/routeDataActions'

import Auth from './Auth'

@connect((store) => {
  return _.cloneDeep(store.routeData)
})
export default class Navigation extends React.Component {

  leftSideButtons() {
    // <Link to="/static/status">Status</Link>
    return (
      <ButtonGroup>
        <Dropdown id="dropdown-static-1" style={{verticalAlign: 'middle', marginLeft: '15px'}}>
          <Dropdown.Toggle  noCaret={true} style={{verticalAlign: 'middle'}}>
            <FontAwesome title="System information" size='2x' name="info-circle" />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <MenuItem>Status</MenuItem>
            <MenuItem onClick={() => {this.props.dispatch(modalActions.showContact())}}>Contact</MenuItem>
            <MenuItem>Help</MenuItem>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown id="dropdown-map-1" style={{verticalAlign: 'middle'}}>
          <Dropdown.Toggle  noCaret={true} style={{verticalAlign: 'middle', height: '43px'}}>
            <FontAwesome title="Configure objects displayed on the map" size='2x' name="map" style={{verticalAlign: 'middle', marginRight: '5px'}}/>
            Map settings
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <div style={{margin: '10px'}}>
              Bunch of checkboxes to define elements displayed on the map
            </div>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown id="dropdown-flightplan-1" style={{verticalAlign: 'middle'}}>
          <Dropdown.Toggle  noCaret={true} style={{verticalAlign: 'middle', height: '43px'}}>
            <FontAwesome title="Provide flight details" size='2x' name="plane" style={{verticalAlign: 'middle', marginRight: '5px'}}/>
            Flight plan
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <div style={{margin: '15px', width: '400px', height: '145px'}}>
              <div style={{marginBottom: '30px'}}>
                Air speed ({this.props.airSpeed}kt):
                <Rcslider defaultValue={this.props.airSpeed} min={15} max={200} step={5} onChange={(v) => {this.props.dispatch(routeDataActions.updateFlightSettings({airSpeed: v}))}}/>
              </div>
              <div style={{marginBottom: '30px'}}>
                Wind direction ({this.props.windDirection}):
                <Rcslider defaultValue={this.props.windDirection} min={0} max={355} step={5} onChange={(v) => {this.props.dispatch(routeDataActions.updateFlightSettings({windDirection: v}))}}/>
              </div>
              <div>
                Wind speed ({this.props.windSpeed}):
                <Rcslider defaultValue={this.props.windSpeed} min={0} max={50} step={1} onChange={(v) => {this.props.dispatch(routeDataActions.updateFlightSettings({windSpeed: v}))}}/>
              </div>
            </div>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown id="dropdown-print-1" style={{verticalAlign: 'middle'}}>
          <Dropdown.Toggle  noCaret={true} style={{verticalAlign: 'middle', height: '43px'}}>
            <FontAwesome title="Print operational flight plan" size='2x' name="print" style={{verticalAlign: 'middle', marginRight: '5px'}}/>
            <strong>Print</strong>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <div style={{margin: '10px'}}>
              Flight plan printout details will come here
            </div>
          </Dropdown.Menu>
        </Dropdown>
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
