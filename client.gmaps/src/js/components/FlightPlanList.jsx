import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { Accordion, Panel, Button } from 'react-bootstrap'
import { FormattedMessage, injectIntl } from 'react-intl'

import { openFlightPlanModalHide } from '../actions/modalsActions'

@injectIntl
@connect(
  (state) => {
    return {
      flightPlans: state.user.flightPlans
    }
  },
  (dispatch) => {
    return {
      closeDialog: () => {
        dispatch(openFlightPlanModalHide())
      }
    }
  }
)
export default class FlightPlanList extends React.Component {

  renderLoading () {
    return (
      <div>
        <FormattedMessage id='pleaseWait' />
      </div>
    )
  }

  renderEmpty () {
    return (
      <div>
        <FormattedMessage id='noSavedFlightPlans' />
      </div>
    )
  }

  renderList () {
    // TODO: make with work with some really long lists (scroll overflow div wrapper)
    const handleClick = (id) => {
      this.props.closeDialog()
      browserHistory.push(`/plan-${id}`)
    }
    const list = this.props.flightPlans.map((plan) =>
      <Panel header={plan.name} key={plan.id} eventKey={plan.id}>
        ID: {plan.id}<br />
        {plan.description || this.props.intl.formatMessage({id: 'noDescription'})}
        <br /><br />
        <Button onClick={handleClick.bind(this, plan.id)}>
          <FormattedMessage id='flightPlans_open' />
        </Button>
      </Panel>
    )
    return (
      <Accordion>
        {list}
      </Accordion>
    )
  }

  render() {
    if (this.props.flightPlans === null) {
      return this.renderLoading()
    } else if (this.props.flightPlans.length === 0) {
      return this.renderEmpty()
    } else {
      return this.renderList()
    }
  }
}
