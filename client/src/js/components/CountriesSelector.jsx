import React from 'react'
import { FormControl } from 'react-bootstrap'
import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'
import { forEach } from 'lodash'

import { updateUi } from '../actions/uiActions'

@injectIntl
@connect(
  (state) => {
    return {
      countries: state.ui.countries,
    }
  },
  (dispatch) => {
    return {
      updateCountries: (e) => {
        let multiValue = []
        forEach(e.target.selectedOptions, (o) => {
          multiValue.push(o.value)
        })
        dispatch(updateUi({countries: multiValue}))
      },
    }
  }
)
export default class CountriesSelector extends React.Component {

  render() {
    const allCountries = ['cz', 'pl', 'de', 'sk', 'lt']

    return (
      <FormControl componentClass="select" multiple defaultValue={this.props.countries} onChange={this.props.updateCountries.bind(this)} >
        { allCountries.map((l) => <option key={l}>{l}</option>) }
      </FormControl>
    );
  }
}
