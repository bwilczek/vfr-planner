import React from 'react'
import { connect } from 'react-redux'
import { Button, Panel } from 'react-bootstrap'
import { browserHistory } from 'react-router'
import { FormattedMessage } from 'react-intl'

import ContactPl from '../components/static/ContactPl'
import ContactEn from '../components/static/ContactEn'

const STATIC_COMPONENTS = {
  'contact': {
    'pl': ContactPl,
    'en': ContactEn
  }
}

@connect(
  (state) => {
    return {
      locale: state.intl.locale
    }
  }
)
export default class StaticPage extends React.Component {

  render() {
    const C = STATIC_COMPONENTS[this.props.params.textId][this.props.locale]

    const footer = (
      <Button onClick={browserHistory.goBack}><FormattedMessage id="back" /></Button>
    )

    return (
      <Panel header={C.getHeader()} footer={footer} style={{width: '600px', marginTop: '20px', marginRight: 'auto', marginLeft: 'auto'}}>
        {C.getContent()}
      </Panel>
    )
  }
}
