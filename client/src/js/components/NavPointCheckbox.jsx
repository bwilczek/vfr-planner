import React from 'react'
import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'

import * as actions from '../actions/aeroDataActions'
import { updateUi } from '../actions/uiActions'

@injectIntl
@connect(
  (state) => {
    return {
      countries: state.ui.countries,
    }
  },
  (dispatch) => {
    return {
      fetchNavPoints: (countries, kinds) => {
        dispatch(actions.fetchNavPoints(countries, kinds))
      },
      clearNavPoints: (kinds) => {
        dispatch(actions.clearNavPointsByKind(kinds))
      },
      handleCheckboxClick: (fields) => {
        dispatch(updateUi(fields))
      }
    }
  }
)
export default class NavPointCheckbox extends React.Component {

  checkboxClicked(kinds) {
    // ucfirst
    const checkboxName = 'checkbox' + this.props.name.charAt(0).toUpperCase() + this.props.name.slice(1)
    const fields = {}
    fields[checkboxName] = !this.props.value
    this.props.handleCheckboxClick(fields)
    if (this.props.value) {
      this.props.clearNavPoints(kinds)
    } else {
      this.props.fetchNavPoints(this.props.countries, kinds)
    }
  }

  render() {
    return (
      <div style={{fontSize: '12px'}}>
        <input
          type="checkbox"
          defaultChecked={this.props.value}
          onChange={this.checkboxClicked.bind(this, this.props.kinds)}
        />
      &nbsp;<FormattedMessage id={this.props.name} />
      </div>
    )
  }
}
