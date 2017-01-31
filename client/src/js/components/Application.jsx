import React from 'react'

import '../../css/font-awesome.min.css'
import '../../css/bootstrap.min.css'

export default class Application extends React.Component {

  render() {
    return (
      <div>
        <div>
          {this.props.children}
        </div>
      </div>
    );
  }
}
