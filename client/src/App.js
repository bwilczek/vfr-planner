import React from 'reactn'
import axios from 'axios'
import { FormattedMessage } from 'react-intl'

export default class App extends React.PureComponent {
  componentWillMount() {
    this.setGlobal(
      axios.get('/api/nav_points?countries[]=pl&kinds[]=vfr_point')
        .then(response => ({point: response.data[0]}))
        .catch(err => ({ error: err }))
    )
    this.setGlobal(
      axios.post('/api/intl', {locale: this.global.locale})
        .then(response => ({translations: {pl: response.data.messages}}))
        .catch(err => ({ error: err }))
    )
  }

  render() {
    return (
      <>
        <div id="point">{this.global.point.name}</div>
        <div>{this.global.error}</div>
        <FormattedMessage id="navAids" />
      </>
    )
  }
}
