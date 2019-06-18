import React from 'reactn'
import { FormattedMessage } from 'react-intl'

import { setLang } from '../state/lang'

export default class Main extends React.PureComponent {
  render() {
    return (
      <div>
        <div>
          <span onClick={setLang.bind(this, 'pl')}>PL</span> | <span onClick={setLang.bind(this, 'en')}>EN</span>
        </div>
       <FormattedMessage id="navPointKind_uncontrolled" />
       <ul>
         { this.global.nav_points.map((p) => <li key={p.name}>{p.name}</li>) }
       </ul>
     </div>
    )
  }
}
