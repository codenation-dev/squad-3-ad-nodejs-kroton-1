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
  }
}

const expectedLogs = {
  oneLog: {
    result: {
      UserId: 1,
      createdAt: '2020-02-15T18:01:01.000Z',
      description: 'Aplicattion down',
      environment: 'production',
      id: 1,
      level: 'FATAL',
      sendDate: '10/10/2019 15:00',
      senderApplication: 'App_1',
      status: 'active',
      updatedAt: '2020-02-15T18:01:01.000Z'
    }
  },
  twoLogs: [{
    UserId: 1,
    createdAt: '2020-02-15T18:01:01.000Z',
    deletedAt: null,
    description: 'Aplicattion down',
    environment: 'production',
    id: 1,
    level: 'FATAL',
    sendDate: '10/10/2019 15:00',
    senderApplication: 'App_1',
    status: 'active',
    updatedAt: '2020-02-15T18:01:01.000Z'
  },
  {
    UserId: 1,
    createdAt: '2020-02-15T18:01:01.000Z',
    deletedAt: null,
    description: 'Aplicattion down',
    environment: 'production',
    id: 2,
    level: 'FATAL',
    sendDate: '10/10/2019 15:00',
    senderApplication: 'App_1',
    status: 'active',
    updatedAt: '2020-02-15T18:01:01.000Z'
  }]
}

module.exports = { mockLogs, expectedLogs }
