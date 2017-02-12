import React from 'react'
import { connect } from 'react-redux'
import { isEmpty } from 'lodash'

import TopMenu from './TopMenu'

import '../../css/font-awesome.min.css'
import '../../css/bootstrap.min.css'
import '../../css/application.scss'

import { fetchIntl } from '../actions/intlActions'

@connect(
  (state) => {
    return { messages: state.intl.messages }
  },
  (dispatch) => {
    return {
      fetchDefaultIntl: () => { dispatch(fetchIntl('en')) }
    }
  }
)
export default class Application extends React.Component {

  componentWillMount() {
    if(isEmpty(this.props.messages)) {
      this.props.fetchDefaultIntl()
    }
  }

  render() {
    return (
      <div>
        <TopMenu />
        <div>
          {this.props.children}
        </div>
      </div>
    );
  }
}