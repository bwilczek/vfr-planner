import React from 'react'
import { connect } from 'react-redux'
import { isEmpty } from 'lodash'
import ReduxToastr from 'react-redux-toastr'
import { injectIntl } from 'react-intl'

import TopMenu from './TopMenu'
import AllModals from './modals'
import ToastrUtils from '../lib/ToastrUtils'

import '../../css/font-awesome.min.css'
import '../../css/bootstrap.min.css'
import '../../css/react-redux-toastr.min.css'
import '../../css/application.scss'

import { fetchIntl } from '../actions/intlActions'

@injectIntl
@connect(
  (state) => {
    return { messages: state.intl.messages }
  },
  (dispatch) => {
    return {
      fetchDefaultIntl: () => { dispatch(fetchIntl('pl')) }
    }
  }
)
export default class Application extends React.Component {

  componentWillMount() {
    ToastrUtils.setup(this.props.intl.formatMessage)
    if (isEmpty(this.props.messages)) {
      this.props.fetchDefaultIntl()
    }
  }

  render() {
    return (
      <div>
        <AllModals />
        <ReduxToastr
          timeOut={4000}
          newestOnTop={false}
          preventDuplicates
          position="top-center"
          transitionIn="fadeIn"
          transitionOut="fadeOut"
          progressBar
        />
        <TopMenu />
        <div>
          {this.props.children}
        </div>
      </div>
    )
  }

}
