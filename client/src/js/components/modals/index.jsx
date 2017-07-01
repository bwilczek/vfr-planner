import React from 'react'

import RenameDialog from './RenameDialog'
import SettingsDialog from './SettingsDialog'
import OpenFlightPlanDialog from './OpenFlightPlanDialog'
import EditFlightPlanDialog from './EditFlightPlanDialog'
import PrintFlightPlanDialog from './PrintFlightPlanDialog'

export default class AllModals extends React.Component {

  render() {
    return (
      <div style={{ display: 'none' }}>
        <RenameDialog />
        <SettingsDialog />
        <OpenFlightPlanDialog />
        <EditFlightPlanDialog />
        <PrintFlightPlanDialog />
      </div>
    )
  }
}
