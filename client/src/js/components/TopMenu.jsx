import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import logo from '../../img/lecimy_logo.png'
import { browserHistory } from 'react-router'

import Auth from './Auth'
import InfoDropdown from './InfoDropdown'

@injectIntl
@connect(
  (state) => {
    return {
      planId: state.flightPlan.id
    }
  }
)
export default class TopMenu extends React.Component {

  navigateToPlannerPage() {
    let path = this.props.planId ? `/plan-${this.props.planId}` : '/'
    browserHistory.push(path)
  }

  render() {
    return (
      <div class="top-menu">
        <div class="top-menu-left">
          <img onClick={this.navigateToPlannerPage.bind(this)} src={logo} />
          <span style={{marginLeft: '10px', display: 'inline'}} class="warning"><FormattedMessage id="notForOperationalUse"/></span>
        </div>
        <div class="top-menu-right">
          <Auth />
          <InfoDropdown />
        </div>
      </div>
    )
  }
}
