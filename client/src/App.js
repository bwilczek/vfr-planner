import React from 'reactn'
import axios from 'axios'
import { FormattedMessage } from 'react-intl'
import { IntlProvider } from 'react-intl'

import { addLocaleData } from 'react-intl'
import plLocaleData from 'react-intl/locale-data/pl'

addLocaleData(plLocaleData)

export default class App extends React.PureComponent {
  componentWillMount() {
    this.setGlobal(
      axios.get('/api/nav_points?countries[]=pl&kinds[]=vfr_point')
        .then(response => ({point: response.data[0]}))
        .catch(err => ({ error: err }))
    )
    this.setGlobal(
      axios.post('/api/intl', {locale: this.global.locale})
        .then(response => ({translations: response.data.messages}))
        .catch(err => ({ error: err }))
    )
  }

  render() {
    return (
      <IntlProvider locale={this.global.locale} defaultLocale="pl" messages={this.global.translations}>
        <div>
          <div id="point">{this.global.point.name}</div>
          <div>Error: {this.global.error}</div>
          <FormattedMessage id="navPointKind_uncontrolled" />
        </div>
      </IntlProvider>
    )
  }
}
