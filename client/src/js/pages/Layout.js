import React from "react";

import Navigation from "../components/Navigation";

export default class Layout extends React.Component {

  render() {
    // console.log(this.props.location)
    return (
      <div style={{backgroundColor: '#ffeeee', height: '100%'}}>
        <Navigation pathname={this.props.location.pathname}/>
        {this.props.children}
      </div>
    );
  }
}
