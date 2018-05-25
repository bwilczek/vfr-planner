import React from 'react'

import RenameDialog from './RenameDialog'
import OpenFlightPlanDialog from './OpenFlightPlanDialog'
import EditFlightPlanDialog from './EditFlightPlanDialog'
import PrintFlightPlanDialog from './PrintFlightPlanDialog'
import AnnouncementDialog from './AnnouncementDialog'

export default class AllModals extends React.Component {

  render() {
    return (
      <div style={{ display: 'none' }}>
        <RenameDialog />
        <OpenFlightPlanDialog />
        <EditFlightPlanDialog />
        <PrintFlightPlanDialog />
        <AnnouncementDialog />
      </div>
    )
  }
}
