const mockLogs = {
  validLog: {
    level: 'FATAL',
    description: 'Aplicattion down',
    senderApplication: 'App_1',
    sendDate: '10/10/2019 15:00',
    environment: 'production'
  },
  validLogAnotherSenderApp: {
    level: 'FATAL',
    description: 'Aplicattion down',
    senderApplication: 'App_2',
    sendDate: '10/10/2019 15:00',
    environment: 'production'
  },
  invalidLogModel: {
    level: 'FATAL',
    description: 'Aplicattion down',
    senderpplication: 'App_1', // Should be senderApplication
    sendDate: '10/10/2019 15:00',
    environment: 'production'
  },
  invalidLogType: {
    level: 'FATAL',
    description: 'Aplicattion down',
    senderpplication: 'App_1',
    sendDate: '10/10/2019 15:00',
    environment: 23 // Should be STRING
  },
  invalidLogDate: {
    level: 'FATAL',
    description: 'Aplicattion down',
    senderApplication: 'App_1',
    sendDate: '25/25/2019 25:00', // Should be MM/dd/yyyy HH:mm
    environment: 'production'
  },
  getLogBySenderApp: {
    senderApplication: 'App_1'
  },
  getLogByAnotherSenderApp: {
    senderApplication: 'App_2'
  }
}

module.exports = { mockLogs }
