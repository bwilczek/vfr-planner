import React from 'react'

import { FormControl, Modal, Button, ButtonGroup, Dropdown, MenuItem } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import { injectIntl, FormattedMessage } from 'react-intl'

import CountriesSelector from '../CountriesSelector'
import LocaleSelector from '../LocaleSelector'

export default class SettingsDialog extends React.Component {

  render() {
    return (
      <Modal show={false}>
        <Modal.Header closeButton>
          <Modal.Title>Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <LocaleSelector />
          <CountriesSelector />
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="danger">Cancel</Button>
          <Button bsStyle="success">Save</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
