import React from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'

import { updatePrintSettings } from '../actions/printActions'

@connect(
  (state) => {
    return {
      printSettings: state.printSettings
    }
  },
  (dispatch) => {
    return {
      updatePrintSettings: (fields) => {
        dispatch(updatePrintSettings(fields))
      }
    }
  }
)
export default class PrintSettingsCheckbox extends React.Component {

  handleClick(e) {
    let fields = {}
    fields[this.props.settingKey] = e.target.checked
    this.props.updatePrintSettings(fields)
  }

  render() {
    return (
      <div>
        <input type="checkbox"
          defaultChecked={this.props.printSettings[this.props.settingKey]}
          onChange={this.handleClick.bind(this)}
        />&nbsp;
        <FormattedMessage id={this.props.settingKey} />
      </div>
    )
  }
}
