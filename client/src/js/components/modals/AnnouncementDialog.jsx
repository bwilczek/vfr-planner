import React from 'react'
import { connect } from 'react-redux'
import { Modal, Button } from 'react-bootstrap'
import { injectIntl, FormattedMessage } from 'react-intl'
import { announcementModalHide } from '../../actions/modalsActions'

@injectIntl
@connect(
  (state) => {
    return {
      dialogOpen: state.modals.announcementOpen
    }
  },
  (dispatch) => {
    return {
      closeDialog: () => {
        dispatch(announcementModalHide())
      }
    }
  }
)
export default class AnnouncementDialog extends React.Component {
  render() {
    return (
      <Modal show={this.props.dialogOpen} onHide={this.props.closeDialog}>
        <Modal.Header closeButton>
          <Modal.Title><FormattedMessage id="warning"/></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormattedMessage id="warningContent"/>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.closeDialog}><FormattedMessage id="close"/></Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
