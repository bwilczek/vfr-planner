import React from 'react'
import FontAwesome from 'react-fontawesome'
import { injectIntl, FormattedMessage } from 'react-intl'
import { DropdownButton, MenuItem } from 'react-bootstrap'
import { browserHistory } from 'react-router'

@injectIntl
export default class InfoDropdown extends React.Component {

  render() {
    return (
      <span>temporary error</span>
    )
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
          <MenuItem onClick={ () => browserHistory.push('/static-help') } eventKey="2">
            <FormattedMessage id='help' />
          </MenuItem>
          <MenuItem onClick={ () => browserHistory.push('/static-status') } eventKey="2">
            <FormattedMessage id='status' />
          </MenuItem>
          <MenuItem onClick={ () => browserHistory.push('/static-privacy') } eventKey="2">
            <FormattedMessage id='privacy' />
          </MenuItem>
        </DropdownButton>

      </span>
    )
  }

}
