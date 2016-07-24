import React from 'react'
var FontAwesome = require('react-fontawesome')
import { Button } from 'react-bootstrap'

export default class StaticPage extends React.Component {

  render() {


    return (
      <div>
        <Button onClick={()=>window.history.back()}><FontAwesome name="angle-left"/> Go back</Button>
        <br />
        Fetch static page content for page '{this.props.params.page}' from server.
      </div>
    )
  }
}
