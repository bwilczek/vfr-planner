import React from 'react'
import { FormattedMessage } from 'react-intl'

import Map from '../components/Map'

export default class PlannerPage extends React.Component {
  render() {
    return (
      <div class="planner-wrapper">
         <div class="planner-left">Column left <FormattedMessage id="airport" /></div>
         <div class="planner-main"><Map /></div>
         <div class="planner-right">Column right</div>
         <div class="clear"/>
      </div>
    )
  }
}
