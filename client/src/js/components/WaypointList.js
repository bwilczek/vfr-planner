import React from 'react';
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';
import { connect } from 'react-redux';
import * as routeDataActions from '../actions/routeDataActions';

const DragHandle = SortableHandle(() => <span style={{cursor: 'ns-resize'}}> || </span>);

const SortableItem = SortableElement(({value}) => <div><DragHandle /> {value.name} {value.heading} {value.distance}</div>);

const SortableList = SortableContainer(({items}) => {
  return (
    <div>
      {items.map((value, index) =>
        <SortableItem key={`item-${value.key}`} index={index} value={value} />
      )}
    </div>
  );
});

@connect((store) => {
  return _.cloneDeep(store.routeData);
})
export default class WaypointList extends React.Component {

  onSortEnd = ({oldIndex, newIndex}) => {
    this.props.dispatch(routeDataActions.reorderWaypoints(arrayMove(this.props.waypoints, oldIndex, newIndex)));
  };

  render() {

    return (
      <SortableList items={this.props.waypoints} onSortEnd={this.onSortEnd.bind(this)} useDragHandle={true}/>
    );
  }

}
