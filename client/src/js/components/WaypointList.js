import React from 'react';

var Sortable = require('react-anything-sortable');

import WaypointListItem from '../components/WaypointListItem';

export default class WaypointList extends React.Component {

  handleSort(data) {
    console.log(data);
  }

  // {this.props.arr.map(renderItem, this)}

  render() {
    return (
      <div>
        <Sortable onSort={this.handleSort.bind(this)} className="vertical-container" direction="vertical" containment="true">
          <WaypointListItem className="vertical" sortData="epws" key={1}>
            React
          </WaypointListItem>
          <WaypointListItem className="vertical" sortData="epkp" key={2}>
            Angular
          </WaypointListItem>
          <WaypointListItem className="vertical" sortData="epru" key={3}>
            Backbone
          </WaypointListItem>
        </Sortable>
      </div>
    );
  }

}
