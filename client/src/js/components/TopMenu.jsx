import React from 'react'
import { connect } from 'react-redux'
import FontAwesome from 'react-fontawesome'
import logo from '../../img/lecimy_logo.png'
import { injectIntl } from 'react-intl'
import { Link } from 'react-router'
import { browserHistory } from 'react-router'

import Auth from './Auth'

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
          <FontAwesome name="cogs" size="3x"
            onClick={() => { browserHistory.push('/settings') }}
            class="auth-button"
            title={formatMessage({id: 'settings'})}
          />
        </div>
      </div>
    )
  }
}
