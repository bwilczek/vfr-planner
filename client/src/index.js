import React from 'reactn'
import { setGlobal } from 'reactn'
import addReactNDevTools from 'reactn-devtools'
import ReactDOM from 'react-dom'
import App from './components/App'

setGlobal({
  locale: '-',
  defaultLocale: 'pl',
  translations: {},
  nav_points: [],
  error: 'none',
  ui: {
    countries: ['pl'],
    nav_points: ['vfr_point', 'uncontrolled']
  }
})

addReactNDevTools()
ReactDOM.render(
  <App />,
  document.getElementById('root')
)
