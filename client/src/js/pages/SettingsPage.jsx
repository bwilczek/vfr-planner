import React from 'react'
import { browserHistory } from 'react-router'

import { Table, Panel, Button } from 'react-bootstrap'
import Toggle from 'react-bootstrap-toggle'
import { FormattedMessage } from 'react-intl'

import CountriesSelector from '../components/CountriesSelector'
import LocaleSelector from '../components/LocaleSelector'

export default class SettingsPage extends React.Component {

  render() {
    const header = (
      <h2>
        <FormattedMessage id="settings" />
      </h2>
    )

    const footer = (
      <Button onClick={browserHistory.goBack}><FormattedMessage id="back" /></Button>
    )

    return (
      <Panel header={header} footer={footer} style={{width: '500px', marginTop: '20px', marginRight: 'auto', marginLeft: 'auto'}}>
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
              <td><Toggle on='kt' off='km/h' size="sm" disabled={true} /></td>
            </tr>
            <tr>
              <td><FormattedMessage id="bearings" /></td>
              <td><Toggle on='MAG' off='GEO' size="sm" disabled={true} /></td>
            </tr>
          </tbody>
        </Table>
      </Panel>
    )
  }
}
