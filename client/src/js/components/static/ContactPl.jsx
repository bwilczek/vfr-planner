import React from 'react'

export default class ContactPl extends React.Component {

  static getHeader() {
    return 'Kontakt'
  }

  static getContent() {
    return (
      <div>
        Bartek Wilczek <br />
        E-mail: bwilczek@gmail.com
      </div>
    )
  }
}
