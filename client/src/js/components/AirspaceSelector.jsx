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
      fetchAirspaces: (countries, mode) => {
        dispatch(actions.fetchAirspaces(countries, mode))
        dispatch(updateUi({selectedAirspaces: mode}))
      },
      clearAirspaces: () => {
        dispatch(actions.clearAirspaces())
        dispatch(updateUi({selectedAirspaces: 'none'}))
      }
    }
  }
)
export default class AirspaceSelector extends React.Component {

  handleAirspaceSelectionChange(e) {
    switch(e.target.dataset.mode) {
      case 'all':
      case 'today':
      case 'tomorrow':
        this.props.fetchAirspaces(this.props.countries, e.target.dataset.mode)
        break
      case 'none':
        this.props.clearAirspaces()
        break
    }
  }

  render() {
    return (
      <div>
        AirspaceSelector <br />
        Countries: {this.props.countries} <br />
        SelectedAirspaces: {this.props.selectedAirspaces} <br />
        <div data-mode='all' onClick={this.handleAirspaceSelectionChange.bind(this)}>fetch all</div>
        <div data-mode='today' onClick={this.handleAirspaceSelectionChange.bind(this)}>fetch today</div>
        <div data-mode='tomorrow' onClick={this.handleAirspaceSelectionChange.bind(this)}>fetch tomorrow</div>
        <div data-mode='none' onClick={this.handleAirspaceSelectionChange.bind(this)}>clear all</div>
      </div>
    )
  }
}
