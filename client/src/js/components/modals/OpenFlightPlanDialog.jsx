import React from 'react'
import { connect } from 'react-redux'

import { Modal, Button, FormGroup, Form, Col, ControlLabel } from 'react-bootstrap'
import { injectIntl, FormattedMessage } from 'react-intl'

import { openFlightPlanModalHide } from '../../actions/modalsActions'
import FlightPlanList from '../../components/FlightPlanList'

@injectIntl
@connect(
  (state) => {
    return {
      dialogOpen: state.modals.openFlightPlanOpen
    }
  },
  (dispatch) => {
    return {
      closeDialog: () => {
        dispatch(openFlightPlanModalHide())
      }
    }
  }
)
export default class OpenFlightPlanDialog extends React.Component {

  render() {
    return (
      <Modal show={this.props.dialogOpen} onHide={this.props.closeDialog}>
        <Modal.Header>
          <Modal.Title><FormattedMessage id="openFlightPlanHeader" /></Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <FlightPlanList />

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.closeDialog}><FormattedMessage id="cancel" /></Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
