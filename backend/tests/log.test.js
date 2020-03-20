/* eslint-env jest */
const request = require('supertest')
const { app } = require('../src/app')
const { sequelize, User, Log } = require('../src/models')
const { mockLogs } = require('./mocks/logs')
const { userPossibilitiesForCreate: userSignup, userPossibilitiesForAuthenticate: userSignin } = require('./mocks/user')

const constantDate = new Date('2020-02-15T18:01:01.000Z')

global.Date = class extends Date {
  constructor() {
    return constantDate
  }
}
beforeAll(async () => {
  await sequelize.drop()
  await sequelize
    .sync({ force: true })
})
afterAll(async () => {
  await sequelize.drop()
  await sequelize.close()
})

describe('The API on /logs endpoint at POST method should...', () => {
  const authorization = []

  const expected = {
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
  }

  beforeEach(async () => {
    await request(app).post('/users/signup').send(userSignup.userWithValidData)
    const { body: { token } } = await request(app).post('/users/signin').send(userSignin.userWithValidData)
    authorization.push(token)
  })

  afterEach(async () => {
    await Log.destroy({
      truncate: true
    })
    await User.destroy({
      truncate: true
    })
    authorization.pop()
  })

  test('returns 200 as status code and the result of the new log created', async () => {
    const res = await request(app).post('/logs')
      .send(mockLogs.validLog)
      .set('Authorization', `Bearer ${authorization[0]}`)

    expect(res.body).toMatchObject(expected)
    expect(res.statusCode).toEqual(200)
  })

  test('returns status code 406 and a message of error when a model is invalid', async () => {
    const res = await request(app).post('/logs')
      .send(mockLogs.invalidLogModel)
      .set('Authorization', `Bearer ${authorization[0]}`)

    expect(res.body).toMatchObject({ error: 'Log body is not valid' })
    expect(res.statusCode).toEqual(406)
  })

  test('returns status code 406 and a message of error when a type is invalid', async () => {
    const res = await request(app).post('/logs')
      .send(mockLogs.invalidLogType)
      .set('Authorization', `Bearer ${authorization[0]}`)

    expect(res.body).toMatchObject({ error: 'Log body is not valid' })
    expect(res.statusCode).toEqual(406)
  })

  test('returns status code 406 and a message of error when a date is invalid', async () => {
    const res = await request(app).post('/logs')
      .send(mockLogs.invalidLogDate)
      .set('Authorization', `Bearer ${authorization[0]}`)

    expect(res.body).toMatchObject({ error: 'Log body is not valid' })
    expect(res.statusCode).toEqual(406)
  })

  test('returns status code 500 and a message of error when a token is missing', async () => {
    const res = await request(app).post('/logs')
      .send(mockLogs.validLog)
      .set('Authorization', 'Bearer')

    expect(res.body).toMatchObject({
      error: {
        message: 'jwt must be provided',
        name: 'JsonWebTokenError'
      }
    })
    expect(res.statusCode).toEqual(500)
  })

  test('returns status code 500 and a message of error when a token is invalid', async () => {
    const res = await request(app).post('/logs')
      .send(mockLogs.validLog)
      .set('Authorization', 'Bearer um.token.qualquer')
    expect(res.body).toMatchObject({
      error: {
        message: 'invalid token'
      }
    })
    expect(res.statusCode).toEqual(500)
  })
})

describe('The API on logs/sender endpoint at GET method should...', () => {
  const authorization = []

  const expected = {
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
  }

  beforeEach(async () => {
    await request(app).post('/users/signup').send(userSignup.userWithValidData)
    const { body: { token } } = await request(app).post('/users/signin').send(userSignin.userWithValidData)
    authorization.push(token)
  })

  afterEach(async () => {
    await Log.destroy({
      truncate: true
    })
    await User.destroy({
      truncate: true
    })
    authorization.pop()
  })

  test('returns status code 406 and a message of error when the id nonexist', async () => {
    const res = await request(app).get('/logs/sender/1').send(mockLogs.getLogBySenderApp).set('Authorization', `Bearer ${authorization[0]}`)
    expect(res.body).toMatchObject({
      message: 'Not acceptable',
      error: 'Nonexistent id'
    })
    expect(res.statusCode).toEqual(406)
  })
})
