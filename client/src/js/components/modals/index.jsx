import React from 'react'

import RenameDialog from './RenameDialog'
import SettingsDialog from './SettingsDialog'
import OpenFlightPlanDialog from './OpenFlightPlanDialog'

export default class AllModals extends React.Component {

  render() {
    return (
      <div style={{ display: 'none' }}>
        <RenameDialog />
        <SettingsDialog />
        <OpenFlightPlanDialog />
      </div>
    )
  }
}
