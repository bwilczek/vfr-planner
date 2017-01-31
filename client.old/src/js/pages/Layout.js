import React from 'react'

import Navigation from '../components/Navigation'
import Modals from '../components/Modals'

export default class Layout extends React.Component {

  render() {
    console.log(this.props.location)
    return (
      <div style={{height: '100%'}}>
        <Navigation pathname={this.props.location.pathname}/>
        {this.props.children}
        <Modals />
      </div>
    )
  }
}
