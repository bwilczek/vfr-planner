import React from 'react'
import { connect } from 'react-redux'
import { getNavigationData } from '../selectors/navigationData'
import { injectIntl } from 'react-intl'

@injectIntl
@connect(
  (state) => {
    return {
      navigationData: getNavigationData(state)
    }
  }
)
export default class WaypointList extends React.Component {

  renderRow(wp) {
    return (
      <div key={wp.key}>{wp.name}</div>
    )
  }

  render() {
    return (
      <div>
        {this.props.navigationData.map((wp) => this.renderRow(wp))}
      </div>
    )
  }
}
