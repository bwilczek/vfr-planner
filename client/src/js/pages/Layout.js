import React from "react";

import Navigation from "../components/Navigation";
import Auth from "../components/Auth";

export default class Layout extends React.Component {

  render() {
    // console.log(this.props.location)
    return (
      <div>
        <Auth />
        <Navigation pathname={this.props.location.pathname}/>
        <hr />
        {this.props.children}
      </div>
    );
  }
}
