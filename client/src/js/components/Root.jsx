import React from 'react'
import { Provider } from 'react-intl-redux'
import { Router, IndexRoute, Route, browserHistory } from 'react-router'
import ReactGA from 'react-ga'

import Application from './Application'
import NotFound from './NotFound'
import PlannerPage from '../pages/PlannerPage'
import StaticPage from '../pages/StaticPage'
import SettingsPage from '../pages/SettingsPage'
import * as secrets from '../secrets'

ReactGA.initialize(secrets.GOOGLE_ANALYTICS_KEY)

export default class Root extends React.Component {

  logPageView() {
    ReactGA.set({ page: window.location.pathname + window.location.search })
    ReactGA.pageview(window.location.pathname + window.location.search)
  }

  render() {
    return (
      <Provider store={this.props.store}>
        <Router history={browserHistory} onUpdate={this.logPageView.bind(this)}>

          <Route path="/" component={Application}>
            <IndexRoute component={PlannerPage}/>
            <Route path="/settings" component={SettingsPage} />
            <Route path="/static-:textId" component={StaticPage} />
            <Route path="/plan-:planId" component={PlannerPage} />
            <Route path="*" component={NotFound} />
          </Route>

        </Router>
      </Provider>
    )
  }
}
