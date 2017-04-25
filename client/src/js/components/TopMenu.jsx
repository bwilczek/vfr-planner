import React from 'react'
import logo from '../../img/lecimy_logo.png'

import Auth from './Auth'

export default class TopMenu extends React.Component {
  render() {
    return (
      <div class="top-menu">
        <div class="top-menu-left">
          <img src={logo} />
        </div>
        <div class="top-menu-right">
          <Auth />
        </div>
      </div>
    )
  }
}
