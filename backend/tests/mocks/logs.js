const logsPossibilities = {
  logWithValidData: {
    level: 'FATAL',
    description: 'Aplicattion down',
    senderApplication: 'App_1',
    sendDate: '10/10/2019 15:00',
    environment: 'production'
  },
  logWithInvalidModel: {
    level: 'FATAL',
    description: 'Aplicattion down',
    senderpplication: 'App_1',
    sendDate: '10/10/2019 15:00',
    environment: 'production'
  }
}

module.exports = { logsPossibilities }
