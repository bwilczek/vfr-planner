import React from 'react'
import { DropdownButton, Button, MenuItem, Glyphicon } from 'react-bootstrap'
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc'
import { connect } from 'react-redux'
import * as routeDataActions from '../actions/routeDataActions'

const DragHandle = SortableHandle(() => <span style={{cursor: 'ns-resize'}}> || </span>)

const SortableItem = SortableElement(({value, dispatch, map}) => {
  let navInfo = ''
  if (value.heading) {
    navInfo = <div>{value.heading}&deg;<br />{value.distance}m</div>
  }
  return (
    <div>
      <DragHandle />
      <DropdownButton bsStyle="default" pullRight="true" bsSize="xsmall" title="&#9660;" noCaret="true" id={`dropdown-${value.key}`}>
        <MenuItem onClick={()=>{map.setCenter(value.latLng)}}><Glyphicon glyph="screenshot"/> Center</MenuItem>
        <MenuItem><Glyphicon glyph="edit"/> Rename</MenuItem>
        <MenuItem onClick={()=>{dispatch(routeDataActions.deleteWaypoint(value))}}><Glyphicon glyph="remove"/> Delete</MenuItem>
      </DropdownButton>
      &nbsp;<span>{value.name}</span>
      {navInfo}
    </div>
  )
})

const SortableList = SortableContainer(({items, dispatch, map}) => {
  return (
    <div>
      {items.map((value, index) =>
        <SortableItem map={map} key={`item-${value.key}`} dispatch={dispatch} index={index} value={value} />
      )}
    </div>
  )
})

@connect((store, props) => {
  let newProps = _.cloneDeep(store.routeData)
  newProps.map = props.map
  return newProps;
})
export default class WaypointList extends React.Component {

  onSortEnd = ({oldIndex, newIndex}) => {
    this.props.dispatch(routeDataActions.reorderWaypoints(arrayMove(this.props.waypoints, oldIndex, newIndex)))
  }

  render() {
    // console.log(this.props.map)
    return (
      <SortableList dispatch={this.props.dispatch} map={this.props.map} items={this.props.waypoints} onSortEnd={this.onSortEnd.bind(this)} useDragHandle={true}/>
    )
  }
}
