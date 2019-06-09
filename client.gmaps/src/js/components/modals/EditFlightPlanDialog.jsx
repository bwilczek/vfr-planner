import React from 'react'
import { connect } from 'react-redux'

import { Modal, Button, FormGroup, FormControl, Form, Col, ControlLabel, Checkbox } from 'react-bootstrap'
import { injectIntl, FormattedMessage } from 'react-intl'

import { editFlightPlanModalHide } from '../../actions/modalsActions'
import * as flightPlanActions from '../../actions/flightPlanActions'

@injectIntl
@connect(
  (state) => {
    return {
      dialogOpen: state.modals.editFlightPlanOpen,
      flightPlan: state.flightPlan
    }
  },
  (dispatch) => {
    return {
      closeDialog: () => {
        dispatch(editFlightPlanModalHide())
      },
      updateFlightPlan(fields) {
        dispatch(flightPlanActions.updateFlightPlan(fields))
      },
      save: (data, formatMessage) => {
        dispatch(flightPlanActions.saveFlightPlan(data, formatMessage))
      }
    }
  }
)
export default class EditFlightPlanDialog extends React.Component {

  updateFlightPlan(field, e) {
    const value = e.target.getAttribute('type') === 'checkbox' ? e.target.checked : e.target.value
    let fields = {}
    fields[field] = value
    this.props.updateFlightPlan(fields)
  }

  handleSave() {
    this.props.save(this.props.flightPlan, this.props.intl.formatMessage)
    this.props.closeDialog()
  }

  render() {
    return (
      <Modal show={this.props.dialogOpen} onHide={this.props.closeDialog}>
        <Modal.Header>
          <Modal.Title><FormattedMessage id="editFlightPlanHeader" /></Modal.Title>
        </Modal.Header>
        <Modal.Body>

        <Form horizontal>

          <FormGroup controlId="formHorizontalID">
            <Col componentClass={ControlLabel} sm={3}>
              <FormattedMessage id="id" />
            </Col>
            <Col sm={9}>
              <FormControl.Static>
                {this.props.flightPlan.id}
              </FormControl.Static>
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalName">
            <Col componentClass={ControlLabel} sm={3}>
              <FormattedMessage id="name" />
            </Col>
            <Col sm={9}>
              <FormControl defaultValue={this.props.flightPlan.name} type="text" onBlur={this.updateFlightPlan.bind(this, 'name')} />
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalDescription">
            <Col componentClass={ControlLabel} sm={3}>
              <FormattedMessage id="description" />
            </Col>
            <Col sm={9}>
              <FormControl defaultValue={this.props.flightPlan.description} componentClass="textarea" onBlur={this.updateFlightPlan.bind(this, 'description')} />
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalIsPublic">
            <Col componentClass={ControlLabel} sm={3}>
              <FormattedMessage id="isPublic" />
            </Col>
            <Col sm={9}>
              <Checkbox defaultChecked={this.props.flightPlan.public} onChange={this.updateFlightPlan.bind(this, 'public')}/>
            </Col>
          </FormGroup>

        </Form>

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.closeDialog}><FormattedMessage id="close" /></Button>
          <Button bsStyle="success" onClick={this.handleSave.bind(this)}><FormattedMessage id="save" /></Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
