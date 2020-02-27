import React from 'react'
import { connect } from 'react-redux'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Button, ButtonGroup, DropdownButton, MenuItem } from 'react-bootstrap'
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc'
import FontAwesome from 'react-fontawesome'

import { getNavigationData } from '../selectors/navigationData'
import { updateUi } from '../actions/uiActions'
import { renameModalShow } from '../actions/modalsActions'
import { deleteWaypoint, reorderWaypoints, reverseWaypoints } from '../actions/flightPlanActions'
import { appendWaypointModalShow } from '../actions/modalsActions'
import * as format from '../lib/Formatter'

// TODO: evaluate if moving styles to CSS files is beneficial, do it if so
const dragHandleStyle = {
  marginLeft: '2px',
  marginRight: '3px',
  width: '5px',
  height: '100%',
  paddingTop: '3px',
  paddingBottom: '3px',
}

const dragHandleInnerStyle = {
  border: '1px solid #999999',
  cursor: 'ns-resize',
  width: '5px',
  height: '100%',
  backgroundColor: '#dddddd',
}

const DragHandle = SortableHandle(() => <div style={dragHandleStyle}><div style={dragHandleInnerStyle}></div></div>)

const SortableItem = SortableElement(({value, dispatch}) => {
  let navInfo = ''
  if (value.segmentDistance) {
    navInfo = (
      <div style={{borderBottom: '1px dotted #999999', width: '100%', marginBottom: '3px'}}>
        <table>
          <tbody>
            <tr>
              <td rowSpan="2" style={{fontSize: '24px', width: '65px', paddingRight: '10px', textAlign: 'right'}}>{value.heading}</td>
              <td>{value.segmentDistance}</td>
            </tr>
            <tr>
              <td dangerouslySetInnerHTML={{__html: value.segmentDuration}} />
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  // TODO: handle too long waypoint names with { textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }
  return (
    <div style={{display: 'flex'}}>
      <div>
        <DragHandle />
      </div>
      <div style={{width: '100%'}}>
        <DropdownButton bsStyle="default" pullRight={true} bsSize="xsmall" title="&#9660;" noCaret={true} id={`dropdown-${value.key}`}>
          <MenuItem onClick={() => { dispatch(updateUi({mapCenter: value.latLng})) }}><FontAwesome name="crosshairs" style={{width: '17px'}}/> <FormattedMessage id="center"/></MenuItem>
          <MenuItem onClick={() => { dispatch(renameModalShow(value.key)) }}><FontAwesome name="edit" style={{width: '17px'}} /> <FormattedMessage id="rename"/></MenuItem>
          <MenuItem onClick={() => { dispatch(deleteWaypoint(value)) }}><FontAwesome name="trash" style={{width: '17px'}} /> <FormattedMessage id="remove"/></MenuItem>
        </DropdownButton>
        &nbsp;<span title={format.coords(value.latLng)} style={{fontSize: '16px', fontWeight: 'bold'}}>{value.name}</span><br />
        {navInfo}
      </div>
    </div>
  )
})

const SortableList = SortableContainer(({items, dispatch}) => {
  return (
    <div>
      {items.map((value, index) =>
        <SortableItem key={`item-${value.key}`} dispatch={dispatch} index={index} value={value} />
      )}
    </div>
  )
})

@injectIntl
@connect(
  (state) => {
    return {
      navigationData: getNavigationData(state),
      appendWaypointModalOpen: state.modals.appendWaypointOpen
    }
  },
  (dispatch) => {
    return {
      openAppendWaypointModal: () => {
        dispatch(appendWaypointModalShow())
      },
      reverseWaypoints: () => {
        dispatch(reverseWaypoints())
      },
      dispatch: dispatch
    }
  }
)
export default class WaypointList extends React.Component {

  onSortEnd = ({oldIndex, newIndex}) => {
    this.props.dispatch(reorderWaypoints(arrayMove(this.props.navigationData.waypoints, oldIndex, newIndex)))
  }

  render() {
    if (this.props.navigationData.waypoints.length === 0) {
      return (
        <div style={{marginTop: '5px', marginLeft: '5px', fontSize: 'large'}}>
          <FormattedMessage id="emptyRouteHeader" /><br /><span style={{fontSize: 'small'}}><FormattedMessage id="emptyRouteDescription" /></span>
          <ButtonGroup>
            <Button style={{width: '190px'}} onClick={this.props.openAppendWaypointModal}><FormattedMessage id="appendWaypoint" /></Button>
          </ButtonGroup>
        </div>
      )
    }
    return (
      <div>
        <SortableList dispatch={this.props.dispatch} items={this.props.navigationData.waypoints} onSortEnd={this.onSortEnd.bind(this)} useDragHandle={true}/>
        <div style={{borderTop: '1px solid', marginTop: '5px', paddingTop: '5px', paddingLeft: '5px'}}>
          <ButtonGroup>
            <Button style={{width: '95px'}} onClick={this.props.openAppendWaypointModal}><FormattedMessage id="appendWaypoint" /></Button>
            <Button style={{width: '95px'}} onClick={this.props.reverseWaypoints}><FormattedMessage id="reverseRoute" /></Button>
          </ButtonGroup>
        </div>
        <div style={{borderTop: '1px solid', marginTop: '5px'}}>
          <FormattedMessage id="totalDistance" />: {this.props.navigationData.totalDistance}<br />
          <FormattedMessage id="totalDuration" />: <span dangerouslySetInnerHTML={{__html: this.props.navigationData.totalDuration}} />
        </div>
      </div>
    )
  }
}
