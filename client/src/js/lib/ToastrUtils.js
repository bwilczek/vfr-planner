let formatMessage = null

export default class ToastrUtils {

  static setup(fm) {
    formatMessage = fm
  }

  static configForSaveFlightPlan() {
    const title = formatMessage({id: 'pleaseWait'})
    const message = formatMessage({id: 'savingInProgress'})
    return {
      id: 'backgroundActionSaveFlightPlan',
      type: 'light',
      title: title,
      attention: true,
      message: message,
      options: {
        progressBar: false,
        showCloseButton: true,
        timeOut: 120000,
        status: 'info',
        icon: 'info'
      }
    }
  }

  static configForPleaseWait() {
    const title = formatMessage({id: 'pleaseWait'})
    const message = formatMessage({id: 'communicationInProgress'})
    return {
      id: 'pleaseWait',
      type: 'light',
      title: title,
      attention: true,
      message: message,
      options: {
        progressBar: false,
        showCloseButton: false,
        timeOut: 120000,
        status: 'info',
        icon: 'info'
      }
    }
  }

  static configForError(errorMessageKey) {
    const title = formatMessage({id: 'errorToastrTitle'})
    const message = formatMessage({id: errorMessageKey})
    return {
      id: 'pleaseWait',
      type: 'error',
      title: title,
      attention: true,
      message: message,
      options: {
        progressBar: false,
        showCloseButton: true,
        timeOut: 120000,
        status: 'info',
        icon: 'info'
      }
    }
  }
}
