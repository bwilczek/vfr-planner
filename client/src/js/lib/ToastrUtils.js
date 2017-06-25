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
}
