import React from 'react'
import { connect } from 'react-redux'

import { FormControl, Modal, Button, ButtonGroup, Dropdown, MenuItem, FormGroup, Form, Col, ControlLabel } from 'react-bootstrap'
import Toggle from 'react-bootstrap-toggle'
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
        <Modal.Header>
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

            <FormGroup controlId="formHorizontalSpeedUnit">
              <Col componentClass={ControlLabel} sm={2}>
                <FormattedMessage id="speedUnit" />
              </Col>
              <Col sm={10}>
                <Toggle
                  on='kt'
                  off='km/h'
                  size="sm"
                  disabled={true}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="formHorizontalBearing">
              <Col componentClass={ControlLabel} sm={2}>
                <FormattedMessage id="bearings" />
              </Col>
              <Col sm={10}>
                <Toggle
                  on='MAG'
                  off='GEO'
                  size="sm"
                  disabled={true}
                />
              </Col>
            </FormGroup>

          </Form>

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.closeDialog}><FormattedMessage id="ok" /></Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
