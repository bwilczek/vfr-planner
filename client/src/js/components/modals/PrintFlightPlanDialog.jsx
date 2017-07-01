import React from 'react'
import { connect } from 'react-redux'
import { Modal, Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

import { printFlightPlanModalHide } from '../../actions/modalsActions'
import { fetchPdf, updatePrintSettings } from '../../actions/printActions'
import { getNavigationData } from '../../selectors/navigationData'
import PrintSettingsCheckbox from '../PrintSettingsCheckbox'

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
      },
      updatePrintSettings: (fields) => {
        dispatch(updatePrintSettings(fields))
      }
    }
  }
)
export default class PrintFlightPlanDialog extends React.Component {

  downloadPdf() {
    this.props.fetchPdf({
      tas: this.props.flightPlan.tas,
      windSpeed: this.props.flightPlan.windSpeed,
      windDirection: this.props.flightPlan.windDirection,
      navigationData: this.props.navigationData,
      printSettings: this.props.printSettings
    })
  }

  render() {
    const checkboxList = Object.keys(this.props.printSettings).map((key) => {
      return <PrintSettingsCheckbox key={key} settingKey={key} />
    })

    return (
      <Modal show={this.props.dialogOpen} onHide={this.props.closeDialog}>
        <Modal.Header closeButton>
          <Modal.Title><FormattedMessage id="printFlightPlanHeader" /></Modal.Title>
        </Modal.Header>
        <Modal.Body>

          {checkboxList}

        </Modal.Body>
        <Modal.Footer>
          <Button disabled>GPX</Button>
          <Button disabled>KML</Button>
          <Button onClick={this.downloadPdf.bind(this)}>PDF</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
