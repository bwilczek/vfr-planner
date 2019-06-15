import React from 'react'
import { connect } from 'react-redux'
import FontAwesome from 'react-fontawesome'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Button, DropdownButton, MenuItem } from 'react-bootstrap'
import { toastr } from 'react-redux-toastr'
import { browserHistory } from 'react-router'

import * as flightPlanActions from '../actions/flightPlanActions'
import * as modalsActions from '../actions/modalsActions'

@injectIntl
@connect(
  (state) => {
    return {
      flightPlan: state.flightPlan,
      user: state.user,
      userPresent: !!state.user.id
    }
  },
  (dispatch) => {
    return {
      save: (data) => {
        dispatch(flightPlanActions.saveFlightPlan(data))
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
      },
      delete: (id, formatMessage) => {
        toastr.confirm(formatMessage({id: 'areYouSure'}), {
          onOk: () => dispatch(flightPlanActions.deleteFlightPlan(id)),
          okText: formatMessage({id: 'yes'}),
          cancelText: formatMessage({id: 'no'})
        })
      }
    }
  }
)
export default class FlightPlanDropdown extends React.Component {

  render() {
    return (
      <span>temp error</span>
    )
    return (
      <span>
        <Button style={{width: '189px'}}
          disabled={!this.props.userPresent}
          onClick={(e) => { document.getElementById('flightPlansDropdown').click(e) }}
        >
          <div>
            <FontAwesome name="map" size="2x" style={{display: 'inline-block', height: '17px', verticalAlign: 'top'}}/>
            <div style={{display: 'inline-block', verticalAlign: 'bottom', height: '23px', marginLeft: '10px', marginTop: '5px', fontWeight: 'bold'}}>
              <FormattedMessage id='flightPlans' />
            </div>
          </div>
        </Button>

        <DropdownButton ref='flightPlansDropdown' title='flightPlansDropdown' id='flightPlansDropdown' class="hidden">
          <MenuItem onClick={this.props.clear.bind(this)} eventKey="1">
            <FormattedMessage id='flightPlans_new' />
          </MenuItem>
          <MenuItem disabled={this.props.user.id === null} onClick={this.props.open.bind(this)} eventKey="2">
            <FormattedMessage id='flightPlans_open' />
          </MenuItem>
          <MenuItem disabled={this.props.flightPlan.id === null} onClick={this.props.save.bind(this, this.props.flightPlan)} eventKey="3">
            <FormattedMessage id='flightPlans_save' />
          </MenuItem>
          <MenuItem disabled={this.props.user.id === null || this.props.flightPlan.waypoints.length < 2} onClick={this.props.saveAs.bind(this)} eventKey="4">
            <FormattedMessage id='flightPlans_save_as' />
          </MenuItem>
          <MenuItem disabled={this.props.flightPlan.id === null} onClick={this.props.update.bind(this)} eventKey="5">
            <FormattedMessage id='flightPlans_update' />
          </MenuItem>
          <MenuItem disabled={this.props.flightPlan.id === null} onClick={this.props.delete.bind(this, this.props.flightPlan.id, this.props.intl.formatMessage)} eventKey="6">
            <FormattedMessage id='flightPlans_delete' />
          </MenuItem>
        </DropdownButton>

      </span>
    )
  }

}
