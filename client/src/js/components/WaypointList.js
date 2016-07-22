import React from 'react'
import { Button } from 'react-bootstrap'
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc'
import { connect } from 'react-redux'
import * as routeDataActions from '../actions/routeDataActions'

const DragHandle = SortableHandle(() => <span style={{cursor: 'ns-resize'}}> || </span>)

const SortableItem = SortableElement(({value, dispatch}) =>
  <div>
    <DragHandle />{value.name}
    <Button onClick={()=>{dispatch(routeDataActions.deleteWaypoint(value))}} bsStyle="link">[-]</Button>
    <br />{value.heading}
    <br />{value.distance}
  </div>
)

const SortableList = SortableContainer(({items, dispatch}) => {
  return (
    <div>
      {items.map((value, index) =>
        <SortableItem key={`item-${value.key}`} dispatch={dispatch} index={index} value={value} />
      )}
    </div>
  )
})

@connect((store) => {
  return _.cloneDeep(store.routeData);
})
export default class WaypointList extends React.Component {

  onSortEnd = ({oldIndex, newIndex}) => {
    this.props.dispatch(routeDataActions.reorderWaypoints(arrayMove(this.props.waypoints, oldIndex, newIndex)))
  }

  render() {
    return (
      <SortableList dispatch={this.props.dispatch} items={this.props.waypoints} onSortEnd={this.onSortEnd.bind(this)} useDragHandle={true}/>
    )
  }
}
