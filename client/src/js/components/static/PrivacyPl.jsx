import React from 'react'

export default class PrivacyPl extends React.Component {

  static getHeader() {
    return 'Polityka prywatności'
  }

  render() {
    return (
      <div>
        Serwis lecimy.org/lecimy.bwilczek.eu wykorzystuje konta użytkowników na Facebooku i Google jedynie w celu autoryzacji dostępu do serwisu.
        Dane użytkowników nie są przekazywane żadnym innym podmiotom.
      </div>
    )
  }
}
