import React from 'react'

import Map from '../components/Map'
import FlightPlanSettings from '../components/FlightPlanSettings'

export default class PlannerPage extends React.Component {
  render() {
    return (
      <div class="planner-wrapper">
         <div class="planner-left"><FlightPlanSettings /></div>
         <div class="planner-main"><Map /></div>
         <div class="planner-right">Column right</div>
         <div class="clear"/>
      </div>
    )
  }
}
