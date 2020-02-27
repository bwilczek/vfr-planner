import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { Panel, Button, PanelGroup } from 'react-bootstrap'
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
    const list = this.props.flightPlans.map((plan, index) =>
      <Panel key={index} eventKey={index}>
        <Panel.Heading>
          <Panel.Title toggle>{plan.name}</Panel.Title>
        </Panel.Heading>
        <Panel.Body collapsible>
          ID: {plan.id}<br />
          {plan.description || this.props.intl.formatMessage({id: 'noDescription'})}
          <br /><br />
          <Button onClick={handleClick.bind(this, plan.id)}>
            <FormattedMessage id='flightPlans_open' />
          </Button>
        </Panel.Body>
      </Panel>
    )
    return (
      <PanelGroup accordion id="save-flight-plans-accordion">
        {list}
      </PanelGroup>
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
