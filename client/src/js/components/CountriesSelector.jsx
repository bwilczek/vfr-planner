import React from 'react'
import { DropdownButton, MenuItem } from 'react-bootstrap'
import { connect } from 'react-redux'

import { updateUi } from '../actions/uiActions'

@connect(
  (state) => {
    return {
      countries: state.ui.countries,
    }
  },
  (dispatch) => {
    return {
      updateCountries: (countries) => {
        dispatch(updateUi({countries}))
      },
    }
  }
)
export default class CountriesSelector extends React.Component {

  render() {
    const allCountries = ['cz', 'pl', 'de', 'sk', 'lt']

    return (
      <div>
        <div>
          { this.props.countries.map((c) => <div key={c}>{c}</div>) }
        </div>
        <hr />
        <DropdownButton bsSize="xsmall" title={this.props.countries} id="bg-nested-dropdown">
          { allCountries.map((l) => <MenuItem key={l}>{l}</MenuItem>) }
        </DropdownButton>
      </div>
    );
  }
}
