import React from 'react'
import { connect } from 'react-redux'
import { Modal, Button } from 'react-bootstrap'
import { injectIntl, FormattedMessage } from 'react-intl'

import { printFlightPlanModalHide } from '../../actions/modalsActions'
import { fetchPdf, fetchKml, fetchGpx, updatePrintSettings } from '../../actions/printActions'
import { getNavigationData } from '../../selectors/navigationData'
import PrintSettingsCheckbox from '../PrintSettingsCheckbox'
import * as format from '../../lib/Formatter'

import buttonPatroniteLogo from '../../../img/patronite-logo.svg'

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
      fetchKml: (data) => {
        dispatch(fetchKml(data))
      },
      fetchGpx: (data) => {
        dispatch(fetchGpx(data))
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
      tas: format.speed(this.props.flightPlan.tas, this.props.flightPlan.speedUnit, 0),
      windSpeed: format.speed(this.props.flightPlan.windSpeed, 'kt', 0),
      windDirection: format.heading(this.props.flightPlan.windDirection),
      navigationData: this.props.navigationData,
      printSettings: this.props.printSettings,
      speedUnit: this.props.flightPlan.speedUnit,
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

  downloadKml() {
    this.props.fetchKml({waypoints: this.props.navigationData.waypoints})
  }

  downloadGpx() {
    this.props.fetchGpx({waypoints: this.props.navigationData.waypoints})
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

          <div style={{width: '100%', textAlign: 'right', fontSize: '18px', verticalAlign: 'middle'}}>
            <a href="https://patronite.pl/patronuj/lecimy-za-5pln/70674" target="_blank">
              <FormattedMessage id="supportUsWith" />&nbsp;
              <img style={{width: '100px'}} src={buttonPatroniteLogo} />
            </a>
          </div>

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.downloadGpx.bind(this)}>GPX</Button>
          <Button onClick={this.downloadKml.bind(this)}>KML</Button>
          <Button onClick={this.downloadPdf.bind(this)}>PDF</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
