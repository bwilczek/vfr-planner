import React from 'react'

export default class ContactEn extends React.Component {

  static getHeader() {
    return 'Contact'
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
