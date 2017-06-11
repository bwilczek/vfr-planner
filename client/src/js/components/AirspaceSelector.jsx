import React from 'react'
import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Button, ButtonGroup } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'

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
    switch (e.target.dataset.mode) {
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
    const { formatMessage } = this.props.intl

    return (
      <div class='planner-left-section'>
        <FormattedMessage id='airspaces'/>: <FormattedMessage id={`airspaceLabel_${this.props.selectedAirspaces}`} />
        <ButtonGroup>
          <Button onClick={this.handleAirspaceSelectionChange.bind(this)} data-mode='none' title={formatMessage({id: 'airspaceLabel_none'})} active={this.props.selectedAirspaces === 'none'} style={{width: '48px'}}>
            <FontAwesome onClick={(e) => { e.target.parentNode.click() }} name="calendar-o"/>
          </Button>
          <Button onClick={this.handleAirspaceSelectionChange.bind(this)} data-mode='all' title={formatMessage({id: 'airspaceLabel_all'})} active={this.props.selectedAirspaces === 'all'} style={{width: '48px'}}>
            <FontAwesome onClick={(e) => { e.target.parentNode.click() }} name="calendar"/>
          </Button>
          <Button onClick={this.handleAirspaceSelectionChange.bind(this)} data-mode='today' title={formatMessage({id: 'airspaceLabel_today'})} active={this.props.selectedAirspaces === 'today'} style={{width: '48px'}}>
            <FontAwesome onClick={(e) => { e.target.parentNode.click() }}name="calendar-check-o"/>
          </Button>
          <Button onClick={this.handleAirspaceSelectionChange.bind(this)} data-mode='tomorrow' title={formatMessage({id: 'airspaceLabel_tomorrow'})} active={this.props.selectedAirspaces === 'tomorrow'} style={{width: '48px'}}>
            <FontAwesome onClick={(e) => { e.target.parentNode.click() }}name="calendar-plus-o"/>
          </Button>
        </ButtonGroup>
      </div>
    )
  }
}
