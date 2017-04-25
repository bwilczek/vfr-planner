import React from 'react'

import RenameDialog from './RenameDialog'

export default class AllModals extends React.Component {

  render() {
    return (
      <div style={{ display: "none" }}>
        <RenameDialog />
      </div>
    );
  }

}
