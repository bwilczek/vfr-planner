import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import logo from '../../img/lecimy_logo.png'
import { injectIntl, FormattedMessage } from 'react-intl'

import Auth from './Auth'
import { settingsModalShow } from '../actions/modalsActions'

@injectIntl
@connect(
  undefined,
  (dispatch) => {
    return {
      showSettingsModal: () => {
        dispatch(settingsModalShow())
      }
    }
  }
)
export default class TopMenu extends React.Component {

  render() {
    const { formatMessage } = this.props.intl

    return (
      <div class="top-menu">
        <div class="top-menu-left">
          <img src={logo} />
        </div>
        <div class="top-menu-right">
          <Auth />
          <FontAwesome name="cogs" size="3x" class="auth-button" title={formatMessage({id: 'settings'})} onClick={this.props.showSettingsModal} />
        </div>
      </div>
    )
  }
}
