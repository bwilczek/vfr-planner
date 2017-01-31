import React from "react";
import { connect } from 'react-redux';

import * as actions from '../actions/itemListActions';

@connect((store) => {
  return _.cloneDeep(store.itemList)
})
export default class ItemList extends React.Component {

  handleAddNewItem(e) {
    this.props.dispatch(actions.add(this.refs.newItem.value));
    this.refs.newItem.value = '';
  }

  render() {

    const list = this.props.items.map((item, i) => <li key={i}>{item}</li>);

    return (
      <div>
        <input ref="newItem" />
        <button onClick={this.handleAddNewItem.bind(this)}>add</button>
        <ul>
          {list}
        </ul>
      </div>
    );
  }

}
