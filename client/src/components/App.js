import React from 'reactn'
import { addLocaleData, IntlProvider } from 'react-intl'
import plLocaleData from 'react-intl/locale-data/pl'

import { setLang } from '../state/lang'
import { setNavPoints } from '../state/nav_points'

import Main from './Main'

addLocaleData(plLocaleData)

export default class App extends React.PureComponent {
  componentDidMount() {
    setNavPoints()
    setLang()
  }

  render() {
    return (
      <IntlProvider locale={this.global.locale} key={this.global.locale} defaultLocale={this.global.defaultLocale} messages={this.global.translations}>
        <Main />
      </IntlProvider>
    )
  }
}
