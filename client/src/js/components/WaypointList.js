import React from 'react';

var Sortable = require('react-anything-sortable');

import WaypointListItem from '../components/WaypointListItem';

export default class WaypointList extends React.Component {

  handleSort(data) {
    console.log(data);
    // TODO: trigger action WAYPOINT_REORDERED
  }

  render() {
    const renderedItems = this.props.waypoints.map((item, index) => <WaypointListItem className="vertical" sortData={item} key={index}>WPT {index+1}</WaypointListItem>);

    return (
      <div>
        <Sortable onSort={this.handleSort.bind(this)} className="vertical-container" direction="vertical" containment="true" dynamic="true">
          {renderedItems}
        </Sortable>
      </div>
    );
  }

}
