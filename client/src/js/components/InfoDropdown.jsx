import React from 'react'
import FontAwesome from 'react-fontawesome'
import { injectIntl, FormattedMessage } from 'react-intl'
import { DropdownButton, MenuItem } from 'react-bootstrap'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'

import { logout } from '../actions/authActions'

@injectIntl
@connect(
  (state) => {
    return {
      userName: state.user.name
    }
  },
  (dispatch) => {
    return {
      logout: () => {
        dispatch(logout())
      }
    }
  }
)
export default class InfoDropdown extends React.Component {

  render() {
    return (
      <span style={{marginRight: '5px'}}>
        <FontAwesome name="bars" size="3x"
          class="auth-button"
          onClick={(e) => { document.getElementById('infoDropdown').click(e) }}
          title={this.props.intl.formatMessage({id: 'info'})}
        />

        <DropdownButton pullRight ref='flightPlansDropdown' title='infoDropdown' id='infoDropdown' style={{top: '+22px'}} class="auth-button hidden">
          <MenuItem onClick={ () => browserHistory.push('/settings') } eventKey="1">
            <FormattedMessage id='settings' />
          </MenuItem>
          <MenuItem onClick={ () => browserHistory.push('/static-contact') } eventKey="2">
            <FormattedMessage id='contact' />
          </MenuItem>
          <MenuItem onClick={ () => browserHistory.push('/static-help') } eventKey="3">
            <FormattedMessage id='help' />
          </MenuItem>
          <MenuItem onClick={ () => browserHistory.push('/static-status') } eventKey="4">
            <FormattedMessage id='status' />
          </MenuItem>
          <MenuItem onClick={ () => browserHistory.push('/static-privacy') } eventKey="5">
            <FormattedMessage id='privacy' />
          </MenuItem>
          <MenuItem disabled={!this.props.userName} onClick={this.props.logout} eventKey="6">
            <FormattedMessage id='logout' />
          </MenuItem>
        </DropdownButton>

      </span>
    )
  }

}
