import React from "react";

import ItemList from '../components/ItemList';
import NavPointList from '../components/NavPointList';

export default class Home extends React.Component {

  render() {
    return (
      <div>
        <ItemList />
        <hr />
        <NavPointList />
      </div>
    );
  }
}
