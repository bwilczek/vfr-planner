import React from 'react';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import { connect } from 'react-redux';
import * as routeDataActions from '../actions/routeDataActions';

const SortableItem = SortableElement(({value}) => <li>{value.lat()}</li>);

const SortableList = SortableContainer(({items}) => {
    return (
        <ul>
            {items.map((value, index) =>
                <SortableItem key={`item-${index}`} index={index} value={value} />
            )}
        </ul>
    );
});

@connect((store) => {
  return _.cloneDeep(store.routeData);
})
export default class WaypointList extends React.Component {

  onSortEnd = ({oldIndex, newIndex}) => {
    console.log(oldIndex, newIndex);
    this.props.dispatch(routeDataActions.reorderWaypoints(arrayMove(this.props.waypoints, oldIndex, newIndex)));
  };

  render() {

    return (
      <SortableList items={this.props.waypoints} onSortEnd={this.onSortEnd.bind(this)} />
    );
  }

}
