import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { DropdownButton, MenuItem } from 'react-bootstrap'
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc'
import FontAwesome from 'react-fontawesome'

import { getNavigationData } from '../selectors/navigationData'
import { updateUi } from '../actions/uiActions'
import { renameModalShow } from '../actions/modalsActions'
import { deleteWaypoint, reorderWaypoints } from '../actions/flightPlanActions'

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
              <td rowSpan="2" style={{fontSize: '24px', width: '65px', paddingRight: '10px', textAlign: 'right'}}>{format.heading(value.heading)}</td>
              <td>{format.distance(value.segmentDistance)}</td>
            </tr>
            <tr>
              <td dangerouslySetInnerHTML={{__html: format.duration(value.segmentDuration)}} />
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
          <MenuItem onClick={() => { dispatch(updateUi({mapCenter: value.latLng})) }}><FontAwesome name="crosshairs" style={{width: '17px'}}/> Center</MenuItem>
          <MenuItem onClick={() => { dispatch(renameModalShow(value.key)) }}><FontAwesome name="edit" style={{width: '17px'}} /> Rename</MenuItem>
          <MenuItem onClick={() => { dispatch(deleteWaypoint(value)) }}><FontAwesome name="trash" style={{width: '17px'}} /> Delete</MenuItem>
        </DropdownButton>
        &nbsp;<span style={{fontSize: '16px', fontWeight: 'bold'}}>{value.name}</span><br />
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
      navigationData: getNavigationData(state)
    }
  }
)
export default class WaypointList extends React.Component {

  onSortEnd = ({oldIndex, newIndex}) => {
    this.props.dispatch(reorderWaypoints(arrayMove(this.props.navigationData.waypoints, oldIndex, newIndex)))
  }

  render() {
    if (this.props.navigationData.length === 0) {
      return <div>This route is empty.<br /><span style={{fontSize: 'x-small'}}>Click on the map to add waypoints.</span></div>
    }
    return (
      <div>
        <SortableList dispatch={this.props.dispatch} items={this.props.navigationData.waypoints} onSortEnd={this.onSortEnd.bind(this)} useDragHandle={true}/>
        <div style={{borderTop: '1px solid', marginTop: '5px'}}>
          Total distance: {format.distance(this.props.navigationData.totalDistance)}<br />
          Total duration: <span dangerouslySetInnerHTML={{__html: format.duration(this.props.navigationData.totalDuration)}} />
        </div>
      </div>
    )
  }
}
