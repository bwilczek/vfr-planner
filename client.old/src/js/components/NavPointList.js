import React from "react";
import { connect } from 'react-redux';

import * as actions from '../actions/navPointListActions';

@connect((store) => {
  return _.cloneDeep(store.navPointList)
})
export default class NavPointList extends React.Component {

  reloadItems() {
    this.props.dispatch(actions.fetchAll());
  }

  componentWillMount() {
    this.reloadItems();
  }

  render() {

    const list = this.props.items.map((item, i) => <li key={i}>{item.name}</li>);

    return (
      <div>
        <button onClick={this.reloadItems.bind(this)}>Reload Items</button>
        <ul>
          {list}
        </ul>
      </div>
    );
  }

}
