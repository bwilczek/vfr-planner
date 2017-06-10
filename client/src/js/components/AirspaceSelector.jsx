import React from 'react'
import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'

import * as actions from '../actions/aeroDataActions'
import { updateUi } from '../actions/uiActions'

@injectIntl
@connect(
  (state) => {
    return {
      selectedAirspaces: state.ui.selectedAirspaces,
      countries: state.ui.countries
    }
  },
  (dispatch) => {
    return {
      fetchAirspaces: (countries) => {
        dispatch(actions.fetchAirspaces(countries))
      },
      clearAirspaces: () => {
        dispatch(actions.clearAirspaces())
      }
    }
  }
)
export default class AirspaceSelector extends React.Component {

  handleAirspaceSelectionChange() {
    this.props.fetchAirspaces(this.props.countries)
  }

  render() {
    return (
      <div>
        AirspaceSelector <br />
        Countries: {this.props.countries} <br />
        SelectedAirspaces: {this.props.selectedAirspaces} <br />
        <span onClick={this.handleAirspaceSelectionChange.bind(this)}>fetch!</span>
      </div>
    )
  }
}
