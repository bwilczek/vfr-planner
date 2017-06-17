import React from 'react'
import { Provider } from 'react-intl-redux'
import { Router, IndexRoute, Route, browserHistory } from 'react-router'

import Application from './Application'
import NotFound from './NotFound'
import PlannerPage from '../pages/PlannerPage'

export default class Root extends React.Component {

  static propTypes = {
    store: React.PropTypes.object.isRequired,
  };

  render() {
    return (
      <Provider store={this.props.store}>
        <Router history={browserHistory}>

          <Route path="/" component={Application}>
            <IndexRoute component={PlannerPage}/>
            <Route path="/settings" component={PlannerPage} />
            <Route path="/plan/:planId" component={PlannerPage} />
            <Route path="*" component={NotFound} />
          </Route>

        </Router>
      </Provider>
    )
  }
}
