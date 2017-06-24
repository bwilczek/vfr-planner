import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import { injectIntl, FormattedMessage } from 'react-intl'
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
    const handleClick = (id) => {
      this.props.closeDialog()
      browserHistory.push(`/plan-${id}`)
    }
    const list = this.props.flightPlans.map((plan) =>
      <li key={plan.id}><a onClick={handleClick.bind(this, plan.id)}>{plan.name}</a></li>
    )
    return (
      <ul>
        {list}
      </ul>
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
