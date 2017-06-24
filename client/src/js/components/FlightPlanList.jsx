import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { Accordion, Panel, Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

import { openFlightPlanModalHide } from '../actions/modalsActions'

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
      <Panel header={plan.name} eventKey={plan.id}>
        {plan.description}
        <br />
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
