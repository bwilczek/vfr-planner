import React from 'react'
import { connect } from 'react-redux'

import { FormControl, Modal, Button, ButtonGroup, Dropdown, MenuItem, FormGroup, Form, Col, ControlLabel } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import { injectIntl, FormattedMessage } from 'react-intl'

import CountriesSelector from '../CountriesSelector'
import LocaleSelector from '../LocaleSelector'

import { settingsModalHide } from '../../actions/modalsActions'

@injectIntl
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
          <Modal.Title><FormattedMessage id="settings" /></Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <Form horizontal>

            <FormGroup controlId="formHorizontalLocale">
              <Col componentClass={ControlLabel} sm={2}>
                <FormattedMessage id="language" />
              </Col>
              <Col sm={10}>
                <LocaleSelector />
              </Col>
            </FormGroup>

            <FormGroup controlId="formHorizontalCountries">
              <Col componentClass={ControlLabel} sm={2}>
                <FormattedMessage id="countries" />
              </Col>
              <Col sm={10}>
                <CountriesSelector />
              </Col>
            </FormGroup>

          </Form>

        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="danger" onClick={this.props.closeDialog}><FormattedMessage id="cancel" /></Button>
          <Button bsStyle="success"><FormattedMessage id="save" /></Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
