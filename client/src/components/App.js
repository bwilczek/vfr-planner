import React from 'reactn'
import { FormattedMessage } from 'react-intl'
import { addLocaleData, IntlProvider } from 'react-intl'
import plLocaleData from 'react-intl/locale-data/pl'

import { setLang } from '../state/lang'
import { setNavPoints } from '../state/nav_points'

addLocaleData(plLocaleData)

export default class App extends React.PureComponent {
  componentWillMount() {
    setNavPoints()
    setLang(this.global.locale)
  }

  render() {
    return (
      <IntlProvider locale={this.global.locale} defaultLocale="pl" messages={this.global.translations}>
        <div>
          <div>
            <span onClick={setLang.bind(this, 'pl')}>PL</span> | <span onClick={setLang.bind(this, 'en')}>EN</span>
          </div>
          <FormattedMessage id="navPointKind_uncontrolled" />
          <ul>
            { this.global.nav_points.map((p) => <li key={p.name}>{p.name}</li>) }
          </ul>
        </div>
      </IntlProvider>
    )
  }
}
