import React from "react";

import Navigation from "../components/Navigation";

export default class Layout extends React.Component {

  render() {
    // console.log(this.props.location)
    return (
      <div>
        <Navigation pathname={this.props.location.pathname}/>
        <hr />
        {this.props.children}
      </div>
    );
  }
}
