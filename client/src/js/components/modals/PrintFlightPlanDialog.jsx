import React from 'react'
import { connect } from 'react-redux'

import { Modal, Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

import { printFlightPlanModalHide } from '../../actions/modalsActions'
import { fetchPdf, updatePrintSettings } from '../../actions/printActions'
import { getNavigationData } from '../../selectors/navigationData'

@connect(
  (state) => {
    return {
      dialogOpen: state.modals.printFlightPlanOpen,
      printSettings: state.printSettings,
      flightPlan: state.flightPlan,
      navigationData: getNavigationData(state)
    }
  },
  (dispatch) => {
    return {
      closeDialog: () => {
        dispatch(printFlightPlanModalHide())
      },
      fetchPdf: (data) => {
        dispatch(fetchPdf(data))
      }
    }
  }
)
export default class PrintFlightPlanDialog extends React.Component {

  render() {

    const handlePdfDownload = () => {
      console.log(this.props.printSettings)
      this.props.fetchPdf({
        flightPlan: this.props.flightPlan,
        navigationData: this.props.navigationData,
        printSettings: this.props.printSettings
      })
    }

    return (
      <Modal show={this.props.dialogOpen} onHide={this.props.closeDialog}>
        <Modal.Header closeButton>
          <Modal.Title><FormattedMessage id="printFlightPlanHeader" /></Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <Button onClick={handlePdfDownload}>PDF</Button>

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.closeDialog}><FormattedMessage id="cancel" /></Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
