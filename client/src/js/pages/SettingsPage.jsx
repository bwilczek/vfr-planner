import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import { Table, Panel, Button } from 'react-bootstrap'
import Toggle from 'react-bootstrap-toggle'
import { FormattedMessage } from 'react-intl'

import CountriesSelector from '../components/CountriesSelector'
import LocaleSelector from '../components/LocaleSelector'
import { toggleSpeedUnit } from '../actions/flightPlanActions'

@connect(
  (state) => {
    return {
      speedUnit: state.flightPlan.speedUnit
    }
  },
  (dispatch) => {
    return {
      toggleSpeedUnit: () => {
        dispatch(toggleSpeedUnit())
      }
    }
  }
)
export default class SettingsPage extends React.Component {

  render() {
    const footer = (
      <Button onClick={browserHistory.goBack}><FormattedMessage id="back" /></Button>
    )

    return (
      <Panel style={{width: '600px', marginTop: '20px', marginRight: 'auto', marginLeft: 'auto'}}>
        <Panel.Heading>
          <Panel.Title componentClass="h3">
            <FormattedMessage id="settings" />
          </Panel.Title>
        </Panel.Heading>
        <Panel.Body>
        <Table condensed hover>
          <tbody>
            <tr>
              <td style={{width: '140px'}}><FormattedMessage id="language" /></td>
              <td><LocaleSelector /></td>
            </tr>
            <tr>
              <td><FormattedMessage id="countries" /></td>
              <td><CountriesSelector /></td>
            </tr>
            <tr>
              <td><FormattedMessage id="speedUnit" /></td>
              <td><Toggle on='kt' off='km/h' size="sm" onClick={this.props.toggleSpeedUnit} active={this.props.speedUnit === 'kt'} /></td>
            </tr>
            <tr>
              <td><FormattedMessage id="bearings" /></td>
              <td><Toggle on='MAG' off='GEO' size="sm" disabled={true} /></td>
            </tr>
          </tbody>
        </Table>
        </Panel.Body>
        <Panel.Footer>
          <Button onClick={() => browserHistory.push('/')}><FormattedMessage id="back" /></Button>
        </Panel.Footer>
      </Panel>
    )
  }
}
