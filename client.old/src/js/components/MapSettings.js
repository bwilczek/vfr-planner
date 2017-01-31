import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import _ from 'lodash'

@connect((store) => {
  return _.cloneDeep(store.routeData)
})
export default class Navigation extends React.Component {
  render() {
    return (
      <div>Bunch of checkboxes to define elements displayed on the map</div>
    )
  }
}
