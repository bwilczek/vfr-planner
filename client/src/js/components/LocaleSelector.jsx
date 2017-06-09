import React from 'react'
import { FormControl } from 'react-bootstrap'
import { connect } from 'react-redux'
import { without } from 'lodash'

import { fetchIntl } from '../actions/intlActions'

@connect(
  (state) => {
    return {
      locale: state.intl.locale,
    }
  },
  (dispatch) => {
    return {
      fetchIntl: (e) => {
        dispatch(fetchIntl(e.target.value))
      }
    }
  }
)
export default class LocaleSelector extends React.Component {

  render() {
    const locales = ['en', 'pl']

    return (

      <FormControl componentClass="select" placeholder={this.props.locale} defaultValue={this.props.locale} onChange={this.props.fetchIntl.bind(this)} >
        { locales.map((l) => <option key={l}>{l}</option>) }
      </FormControl>

    );
  }
}
