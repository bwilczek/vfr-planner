import React from 'react'
import { connect } from 'react-redux'
import { Modal, Button } from 'react-bootstrap'
import { injectIntl, FormattedMessage } from 'react-intl'

import { printFlightPlanModalHide } from '../../actions/modalsActions'
import { fetchPdf, updatePrintSettings } from '../../actions/printActions'
import { getNavigationData } from '../../selectors/navigationData'
import PrintSettingsCheckbox from '../PrintSettingsCheckbox'
import * as format from '../../lib/Formatter'

@injectIntl
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

    const fm = this.props.intl.formatMessage

    this.props.fetchPdf({
      tas: format.speed(this.props.flightPlan.tas, 0),
      windSpeed: format.speed(this.props.flightPlan.windSpeed, 0),
      windDirection: format.heading(this.props.flightPlan.windDirection),
      navigationData: this.props.navigationData,
      printSettings: this.props.printSettings,
      intl: {
        flightPlan: fm({id: 'flightPlan'}),
        wind: fm({id: 'wind'}),
        tas: fm({id: 'tas'}),
        headerWpt: fm({id: 'headerWpt'}),
        headerCoords: fm({id: 'headerCoords'}),
        headerCourse: fm({id: 'headerCourse'}),
        headerCourseMag: fm({id: 'headerCourseMag'}),
        headerHeading: fm({id: 'headerHeading'}),
        headerSegmentDistance: fm({id: 'headerSegmentDistance'}),
        headerGroundSpeed: fm({id: 'headerGroundSpeed'}),
        headerSegmentDuration: fm({id: 'headerSegmentDuration'}),
        headerSubTotalDuration: fm({id: 'headerSubTotalDuration'})
      }
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
