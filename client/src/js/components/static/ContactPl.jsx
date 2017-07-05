import React from 'react'

export default class ContactPl extends React.Component {

  static getHeader() {
    return 'Kontakt'
  }

  render() {
    return (
      <div>
        Bartek Wilczek <br />
        E-mail: bwilczek@gmail.com
      </div>
    )
  }
}
