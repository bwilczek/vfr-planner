import React from 'react'
import { connect } from 'react-redux'
import FontAwesome from 'react-fontawesome'
import { injectIntl, FormattedMessage } from 'react-intl'
import { DropdownButton, MenuItem } from 'react-bootstrap'
import { toastr } from 'react-redux-toastr'
import { browserHistory } from 'react-router'

import * as flightPlanActions from '../actions/flightPlanActions'
import * as modalsActions from '../actions/modalsActions'

@injectIntl
@connect(
  (state) => {
    return {
      flightPlan: state.flightPlan,
      user: state.user
    }
  },
  (dispatch) => {
    return {
      save: (data, title, message) => {
        dispatch(flightPlanActions.saveFlightPlan(data, title, message))
      },
      clear: () => {
        dispatch(flightPlanActions.updateFlightPlan({
          waypoints: [],
          name: '',
          description: '',
          id: null,
          public: false
        }))
        browserHistory.push('/')
      },
      open: () => {
        dispatch(flightPlanActions.fetchFlightPlans())
        dispatch(modalsActions.openFlightPlanModalShow())
      },
      saveAs: () => {
        dispatch(flightPlanActions.updateFlightPlan({id: null}))
        dispatch(modalsActions.editFlightPlanModalShow())
      },
      update: () => {
        dispatch(modalsActions.editFlightPlanModalShow())
      }
    }
  }
)
export default class FlightPlanDropdown extends React.Component {

  render() {
    const notImplementedYet = () => { toastr.info(this.props.intl.formatMessage({id: 'notImplementedYet'}), this.props.intl.formatMessage({id: 'featureComingSoon'})) }
    const handleSave = () => {
      this.props.save(this.props.flightPlan, this.props.intl.formatMessage)
    }

    return (
      <span style={{marginRight: '5px'}}>
        <FontAwesome name="list-ul" size="3x"
          class="auth-button"
          onClick={(e) => { document.getElementById('flightPlansDropdown').click(e) }}
          title={this.props.intl.formatMessage({id: 'flightPlans'})}
        />

        <DropdownButton pullRight ref='flightPlansDropdown' title='flightPlansDropdown' id='flightPlansDropdown' style={{top: '+22px'}} class="auth-button hidden">
          <MenuItem onClick={this.props.clear.bind(this)} eventKey="1">
            <FormattedMessage id='flightPlans_new' />
          </MenuItem>
          <MenuItem disabled={this.props.user.id === null} onClick={this.props.open.bind(this)} eventKey="2">
            <FormattedMessage id='flightPlans_open' />
          </MenuItem>
          <MenuItem disabled={this.props.flightPlan.id === null} onClick={handleSave} eventKey="3">
            <FormattedMessage id='flightPlans_save' />
          </MenuItem>
          <MenuItem disabled={this.props.user.id === null || this.props.flightPlan.waypoints.length < 2} onClick={this.props.saveAs.bind(this)} eventKey="4">
            <FormattedMessage id='flightPlans_save_as' />
          </MenuItem>
          <MenuItem disabled={this.props.flightPlan.id === null} onClick={this.props.update.bind(this)} eventKey="5">
            <FormattedMessage id='flightPlans_update' />
          </MenuItem>
          <MenuItem disabled={this.props.flightPlan.id === null} onClick={notImplementedYet} eventKey="6">
            <FormattedMessage id='flightPlans_delete' />
          </MenuItem>
        </DropdownButton>

      </span>
    )
  }

}
