import React from 'react'
import { FormattedMessage } from 'react-intl'

export default class Status extends React.Component {

  static getHeader() {
    return 'Status'
  }

  render() {
    return (
      <div>
        <FormattedMessage id="statusComingSoon" />
        <br />
        patronite
      </div>
    )
  }
}
