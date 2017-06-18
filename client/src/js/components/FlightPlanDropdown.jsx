import React from 'react'
import { connect } from 'react-redux'
import FontAwesome from 'react-fontawesome'
import { injectIntl, FormattedMessage } from 'react-intl'
import { DropdownButton, MenuItem } from 'react-bootstrap'
import { toastr } from 'react-redux-toastr'

@injectIntl
@connect(
  (state) => {
    return {
      user: {
        name: state.user.name,
        img: state.user.img
      }
    }
  },
  (dispatch) => {
    return {
      // handleResponseFacebook: (response) => {
      //   dispatch(actions.authenticate('facebook', response.accessToken))
      // }
    }
  }
)
export default class FlightPlanDropdown extends React.Component {

  render() {
    const { formatMessage } = this.props.intl

    const notImplementedYet = () => { toastr.info(formatMessage({id: 'notImplementedYet'}), formatMessage({id: 'featureComingSoon'})) }

    return (
      <span style={{marginRight: '5px'}}>
        <FontAwesome name="list-ul" size="3x"
          class="auth-button"
          onClick={(e) => { document.getElementById('flightPlansDropdown').click(e) }}
          title={formatMessage({id: 'flightPlans'})}
        />

        <DropdownButton pullRight ref='flightPlansDropdown' title='flightPlansDropdown' id='flightPlansDropdown' style={{top: '+22px'}} class="auth-button hidden">
          <MenuItem onClick={notImplementedYet} eventKey="1">
            <FormattedMessage id='flightPlans_new' />
          </MenuItem>
          <MenuItem onClick={notImplementedYet} eventKey="2">
            <FormattedMessage id='flightPlans_open' />
          </MenuItem>
          <MenuItem onClick={notImplementedYet} eventKey="3">
            <FormattedMessage id='flightPlans_save' />
          </MenuItem>
          <MenuItem onClick={notImplementedYet} eventKey="4">
            <FormattedMessage id='flightPlans_save_as' />
          </MenuItem>
          <MenuItem onClick={notImplementedYet} eventKey="5">
            <FormattedMessage id='flightPlans_update' />
          </MenuItem>
          <MenuItem onClick={notImplementedYet} eventKey="6">
            <FormattedMessage id='flightPlans_delete' />
          </MenuItem>
        </DropdownButton>

      </span>
    )
  }

}
