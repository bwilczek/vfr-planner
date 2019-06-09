import React from 'react'
import { setGlobal, getGlobal } from 'reactn'
import { IntlProvider } from 'react-intl'
import addReactNDevTools from 'reactn-devtools'
import ReactDOM from 'react-dom'
import App from './App'

setGlobal({
  locale: 'pl',
  translations: {'pl': {navAids: 'asdad'}},
  point: {name: 'loading...'},
  error: 'none'
})

addReactNDevTools()
ReactDOM.render(
  <IntlProvider locale="pl" messages={getGlobal().translations}>
    <App />
  </IntlProvider>,
  document.getElementById('root')
)
