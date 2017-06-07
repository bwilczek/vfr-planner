import React from 'react'
import { connect } from 'react-redux'

import { FormControl, Modal, Button, ButtonGroup, Dropdown, MenuItem } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import { injectIntl, FormattedMessage } from 'react-intl'

import CountriesSelector from '../CountriesSelector'
import LocaleSelector from '../LocaleSelector'

import { settingsModalHide } from '../../actions/modalsActions'

@connect(
  (state) => {
    return {
      dialogOpen: state.modals.settingsOpen,
    }
  },
  (dispatch) => {
    return {
      closeDialog: () => {
        dispatch(settingsModalHide())
      },
    }
  }
)export default class SettingsDialog extends React.Component {

  render() {
    return (
      <Modal show={this.props.dialogOpen} onHide={this.props.closeDialog}>
        <Modal.Header closeButton>
          <Modal.Title>Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <LocaleSelector />
          <CountriesSelector />
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="danger" onClick={this.props.closeDialog}>Cancel</Button>
          <Button bsStyle="success">Save</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
