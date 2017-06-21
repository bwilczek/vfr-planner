export function configForSaveFlightPlan(title, message) {
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
