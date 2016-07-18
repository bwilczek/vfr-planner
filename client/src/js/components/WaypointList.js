import React from 'react';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';

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

export default class WaypointList extends React.Component {

  onSortEnd = ({oldIndex, newIndex}) => {
    console.log(oldIndex, newIndex);
    arrayMove(this.props.waypoints, oldIndex, newIndex);
  };

  render() {

    return (
      <SortableList items={this.props.waypoints} onSortEnd={this.onSortEnd.bind(this)} />
    );
  }

}
