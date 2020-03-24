/* eslint-env jest */
const request = require('supertest')
const { app } = require('../src/app')
const { sequelize } = require('../src/models')
const { mockLogs, expectedLogs } = require('./mocks/logs')
const { userPossibilitiesForCreate: { userWithValidData: userSignup } } = require('./mocks/user')
const { userPossibilitiesForAuthenticate: { userWithValidData: userSignin } } = require('./mocks/user')

const authorization = []

const constantDate = new Date('2020-02-15T18:01:01.000Z')

global.Date = class extends Date {
  constructor() {
    return constantDate
  }
}

async function signUp(user) {
  await request(app)
    .post('/users/signup')
    .send(user)
}

async function signIn(user) {
  const { body: { token } } = await request(app)
    .post('/users/signin')
    .send(user)
  authorization.push(token)
}

async function createLog(log) {
  return request(app)
    .post('/logs').send(log)
    .set('Authorization', `Bearer ${authorization[0]}`)
}

async function syncDB() {
  await sequelize.sync({ force: true })
  authorization.pop()
}

beforeAll(async () => {
  await sequelize.sync({ force: true })
})

afterAll(async () => {
  await sequelize.drop()
  await sequelize.close()
})

describe('The API on /logs/sender/:senderApplication endpoint at GET method should...', () => {
  beforeEach(async () => {
    await signUp(userSignup)
    await signIn(userSignin)
  })

  afterEach(async () => {
    await syncDB()
  })

  test('returns status code 200 and all logs of sender application', async () => {
    await createLog(mockLogs.validLog)
    await createLog(mockLogs.validLog)

    const res = await request(app)
      .get('/logs/sender/App_1')
      .set('Authorization', `Bearer ${authorization[0]}`)

    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual(expectedLogs.twoLogs)
  })

  test('returns status code 200 and a message when there are no logs ', async () => {
    const res = await request(app)
      .get('/logs/sender/fakesender')
      .set('Authorization', `Bearer ${authorization[0]}`)

    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({ message: 'There are no logs' })
  })

  test.only('returns status code 401 and a message of error when token is missing', async () => {
    const res = await request(app)
      .get('/logs/environment/production')
      .set('Authorization', 'Bearer')

    //expect(res.statusCode).toEqual(401)
    expect(res.body).toMatchObject({ error: { message: 'qualquer coisa' } })
  })
})

describe('The API on /logs/environment/:environment endpoint at GET method should...', () => {
  beforeEach(async () => {
    await signUp(userSignup)
    await signIn(userSignin)
    await createLog(mockLogs.validLog)
    await createLog(mockLogs.validLog)
  })

  afterEach(async () => {
    await syncDB()
  })

  test('returns status code 200 and a successfull message', async () => {
    const res = await request(app)
      .get('/logs/environment/production')
      .set('Authorization', `Bearer ${authorization[0]}`)

    expect(res.statusCode).toEqual(200)
    expect(res.body).toMatchObject(expectedLogs.twoLogs)
  })

  test('returns status code 200 when environment is uppercase', async () => {
    const res = await request(app)
      .get('/logs/environment/PRODUCTION')
      .set('Authorization', `Bearer ${authorization[0]}`)

    expect(res.statusCode).toEqual(200)
    expect(res.body).toMatchObject(expectedLogs.twoLogs)
  })

  test('returns status code 406 when environment is in portuguese', async () => {
    const res = await request(app)
      .get('/logs/environment/produção')
      .set('Authorization', `Bearer ${authorization[0]}`)

    expect(res.statusCode).toEqual(406)
    expect(res.body).toMatchObject({ message: 'Invalid environment' })
  })

  test('returns status code 500 and a message of error when token is invalid', async () => {
    const res = await request(app)
      .get('/logs/environment/production')
      .set('Authorization', 'Bearer um.token.qualquer')

    expect(res.statusCode).toEqual(500)
    expect(res.body).toMatchObject({ error: { message: 'invalid token' } })
  })

  test('returns status code 500 and a message of error when token is missing', async () => {
    const res = await request(app)
      .get('/logs/environment/production')
      .set('Authorization', 'Bearer')

    expect(res.statusCode).toEqual(500)
    expect(res.body).toMatchObject({ error: { message: 'jwt must be provided' } })
  })

  test('returns status code 406 and a message of error when token is not provided', async () => {
    const res = await request(app)
      .get('/logs/environment/production')

    expect(res.statusCode).toEqual(406)
    expect(res.body).toMatchObject({ error: 'Token not provided' })
  })
})

describe('The API on /logs/level/:level endpoint at GET method should...', () => {
  beforeEach(async () => {
    await signUp(userSignup)
    await signIn(userSignin)
    await createLog(mockLogs.validLog)
    await createLog(mockLogs.validLog)
  })

  afterEach(async () => {
    await syncDB()
  })

  test('returns status code 200 when level is uppercase', async () => {
    const res = await request(app)
      .get('/logs/level/FATAL')
      .set('Authorization', `Bearer ${authorization[0]}`)

    expect(res.statusCode).toEqual(200)
    expect(res.body).toMatchObject(expectedLogs.twoLogs)
  })

  test('returns status code 200 and when level is lowercase', async () => {
    const res = await request(app)
      .get('/logs/level/fatal')
      .set('Authorization', `Bearer ${authorization[0]}`)

    expect(res.statusCode).toEqual(200)
    expect(res.body).toMatchObject(expectedLogs.twoLogs)
  })

  test('returns status code 200 and when level is lowercase and uppercase', async () => {
    const res = await request(app)
      .get('/logs/level/FAtal')
      .set('Authorization', `Bearer ${authorization[0]}`)

    expect(res.statusCode).toEqual(200)
    expect(res.body).toMatchObject(expectedLogs.twoLogs)
  })

  test('returns status code 406 when level is invalid', async () => {
    const res = await request(app)
      .get('/logs/level/something')
      .set('Authorization', `Bearer ${authorization[0]}`)

    expect(res.statusCode).toEqual(406)
    expect(res.body).toMatchObject({ message: 'Level does not exist' })
  })

  test('returns status code 500 when token is missing', async () => {
    const res = await request(app)
      .get('/logs/level/Fatal')
      .set('Authorization', 'Bearer ')

    expect(res.statusCode).toEqual(500)
    expect(res.body).toMatchObject({ error: { message: 'jwt must be provided' } })
  })

  test('returns status code 500 and a message of error when token is invalid', async () => {
    const res = await request(app)
      .get('/logs/environment/production')
      .set('Authorization', 'Bearer um.token.qualquer')

    expect(res.statusCode).toEqual(500)
    expect(res.body).toMatchObject({ error: { message: 'invalid token' } })
  })

  test('returns status code 500 and a message of error when token is missing', async () => {
    const res = await request(app)
      .get('/logs/environment/production')
      .set('Authorization', 'Bearer')

    expect(res.statusCode).toEqual(500)
    expect(res.body).toMatchObject({ error: { message: 'jwt must be provided' } })
  })

  test('returns status code 406 when token is not provided', async () => {
    const res = await request(app)
      .get('/logs/level/Fatal')

    expect(res.statusCode).toEqual(406)
    expect(res.body).toMatchObject({ error: 'Token not provided' })
  })
})

describe('The API on /logs endpoint at POST method should...', () => {
  beforeEach(async () => {
    await signUp(userSignup)
    await signIn(userSignin)
  })

  afterEach(async () => {
    await syncDB()
  })

  test('returns 200 as status code and the result of the new log created', async () => {
    const res = await createLog(mockLogs.validLog)

    expect(res.statusCode).toEqual(200)
    expect(res.body).toMatchObject(expectedLogs.oneLog)
  })

  test('returns status code 406 and a message of error when a model is invalid', async () => {
    const res = await request(app).post('/logs')
      .send(mockLogs.invalidLogModel)
      .set('Authorization', `Bearer ${authorization[0]}`)

    expect(res.statusCode).toEqual(406)
    expect(res.body).toMatchObject({ error: 'Log body is not valid' })
  })

  test('returns status code 406 and a message of error when a type is invalid', async () => {
    const res = await request(app).post('/logs')
      .send(mockLogs.invalidLogType)
      .set('Authorization', `Bearer ${authorization[0]}`)

    expect(res.statusCode).toEqual(406)
    expect(res.body).toMatchObject({ error: 'Log body is not valid' })
  })

  test('returns status code 406 and a message of error when a date is invalid', async () => {
    const res = await request(app).post('/logs')
      .send(mockLogs.invalidLogDate)
      .set('Authorization', `Bearer ${authorization[0]}`)

    expect(res.statusCode).toEqual(406)
    expect(res.body).toMatchObject({ error: 'Log body is not valid' })
  })

  test('returns status code 500 and a message of error when a token is missing', async () => {
    const res = await request(app).post('/logs')
      .send(mockLogs.validLog)
      .set('Authorization', 'Bearer')

    expect(res.statusCode).toEqual(500)
    expect(res.body).toMatchObject({
      error: { message: 'jwt must be provided', name: 'JsonWebTokenError' }
    })
  })

  test('returns status code 500 and a message of error when a token is invalid', async () => {
    const res = await request(app).post('/logs')
      .send(mockLogs.validLog)
      .set('Authorization', 'Bearer um.token.qualquer')

    expect(res.statusCode).toEqual(500)
    expect(res.body).toMatchObject({ error: { message: 'invalid token' } })
  })
})

describe('The API on /logs/restore/id/:id Endpoint at POST method should...', () => {
  beforeEach(async () => {
    await signUp(userSignup)
    await signIn(userSignin)
    await createLog(mockLogs.validLog)
  })

  afterEach(async () => {
    await syncDB()
  })

  test('return status code 200 and a message of successfully', async () => {
    await request(app)
      .delete('/logs/all')
      .set('Authorization', `Bearer ${authorization[0]}`)
    const res = await request(app)
      .post('/logs/restore/1')
      .set('Authorization', `Bearer ${authorization[0]}`)

    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({ message: 'All logs restored successfully.' })
  })

  test('return status code 400 and a message when log has deleted hard', async () => {
    await request(app)
      .delete('/logs/all/hard')
      .set('Authorization', `Bearer ${authorization[0]}`)

    const res = await request(app)
      .post('/logs/restore/1')
      .set('Authorization', `Bearer ${authorization[0]}`)

    expect(res.statusCode).toEqual(400)
    expect(res.body).toEqual({ message: 'There is no logs to restore' })
  })

  test('return status code 500 when token not provided', async () => {
    const res = await request(app)
      .post('/logs/restore/1')
      .set('Authorization', 'Bearer ')

    expect(res.statusCode).toEqual(500)
    expect(res.body).toEqual({
      error: {
        message: 'jwt must be provided',
        name: 'JsonWebTokenError'
      }
    })
  })

  test('return status code 500 when token are incorrect ', async () => {
    const res = await request(app)
      .post('/logs/restore/1')
      .set('Authorization', 'Bearer some.token')

    expect(res.statusCode).toEqual(500)
    expect(res.body).toEqual({
      error: {
        message: 'jwt malformed',
        name: 'JsonWebTokenError'
      }
    })
  })

  test('returns status code 404 and a message when the log does not exist', async () => {
    const res = await request(app)
      .delete('/logs/restore/90')
      .set('Authorization', `Bearer ${authorization[0]}`)

    expect(res.statusCode).toEqual(404)
    expect(res.body).toEqual({})
  })

  test('returns status code 404 and an empty obj when log id is missing', async () => {
    const res = await request(app)
      .delete('/logs/restore/')
      .set('Authorization', `Bearer ${authorization[0]}`)

    expect(res.statusCode).toEqual(404)
    expect(res.body).toEqual({})
  })
})

describe('The API on /logs/restore/all Endpoint at POST method should...', () => {
  beforeEach(async () => {
    await signUp(userSignup)
    await signIn(userSignin)
    await createLog(mockLogs.validLog)
  })

  afterEach(async () => {
    await syncDB()
  })

  test('return status code 200 and a message of successfully', async () => {
    await request(app)
      .delete('/logs/all')
      .set('Authorization', `Bearer ${authorization[0]}`)
    const res = await request(app)
      .post('/logs/restore')
      .set('Authorization', `Bearer ${authorization[0]}`)

    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({ message: 'All logs restored successfully.' })
  })

  test('return status code 400 and a message when log has deleted hard', async () => {
    await request(app)
      .delete('/logs/all/hard')
      .set('Authorization', `Bearer ${authorization[0]}`)

    const res = await request(app)
      .post('/logs/restore')
      .set('Authorization', `Bearer ${authorization[0]}`)

    expect(res.statusCode).toEqual(400)
    expect(res.body).toEqual({ message: 'There is no logs to restore' })
  })

  test('return status code 500 when token not provided', async () => {
    const res = await request(app)
      .post('/logs/restore')
      .set('Authorization', 'Bearer ')

    expect(res.statusCode).toEqual(500)
    expect(res.body).toEqual({
      error: {
        message: 'jwt must be provided',
        name: 'JsonWebTokenError'
      }
    })
  })

  test('return status code 500 when token are incorrect ', async () => {
    const res = await request(app)
      .post('/logs/restore')
      .set('Authorization', 'Bearer some.token')

    expect(res.statusCode).toEqual(500)
    expect(res.body).toEqual({
      error: {
        message: 'jwt malformed',
        name: 'JsonWebTokenError'
      }
    })
  })
})

describe('The API on /logs/id/:id endpoint at DELETE method should...', () => {
  beforeEach(async () => {
    await signUp(userSignup)
    await signIn(userSignin)
    await createLog(mockLogs.validLog)
  })

  afterEach(async () => {
    await syncDB()
  })

  test('returns status code 200 and a successfull message', async () => {
    const res = await request(app)
      .delete('/logs/id/1')
      .set('Authorization', `Bearer ${authorization[0]}`)

    expect(res.statusCode).toEqual(200)
    expect(res.body).toMatchObject({ message: 'Deleted successfully' })
  })

  test('returns status code 406 and a message when the log does not exist', async () => {
    const res = await request(app)
      .delete('/logs/id/90')
      .set('Authorization', `Bearer ${authorization[0]}`)

    expect(res.statusCode).toEqual(406)
    expect(res.body).toMatchObject({ message: 'Log not existis.' })
  })

  test('returns status code 404 and an empty obj when log id is missing', async () => {
    const res = await request(app)
      .delete('/logs/id')
      .set('Authorization', `Bearer ${authorization[0]}`)

    expect(res.statusCode).toEqual(404)
    expect(res.body).toMatchObject({})
  })

  test('returns status code 500 and a message of error when token is invalid', async () => {
    const res = await request(app)
      .delete('/logs/id/1')
      .set('Authorization', 'Bearer um.token.qualquer')

    expect(res.statusCode).toEqual(500)
    expect(res.body).toMatchObject({ error: { message: 'invalid token' } })
  })

  test('returns status code 500 and a message of error when token is missing', async () => {
    const res = await request(app)
      .delete('/logs/id/1')
      .set('Authorization', 'Bearer')

    expect(res.statusCode).toEqual(500)
    expect(res.body).toMatchObject({ error: { message: 'jwt must be provided' } })
  })
})

describe('The API on /logs/all endpoint at DELETE method should...', () => {
  beforeEach(async () => {
    await signUp(userSignup)
    await signIn(userSignin)
  })

  afterEach(async () => {
    await syncDB()
  })

  test('returns status code 200 and a successfull message', async () => {
    await createLog(mockLogs.validLog)

    const res = await request(app)
      .delete('/logs/all')
      .set('Authorization', `Bearer ${authorization[0]}`)

    expect(res.statusCode).toEqual(200)
    expect(res.body).toMatchObject({ message: 'Deleted successfully' })
  })

  test('returns status code 406 when there is no log to delete', async () => {
    const res = await request(app)
      .delete('/logs/all')
      .set('Authorization', `Bearer ${authorization[0]}`)

    expect(res.statusCode).toEqual(406)
    expect(res.body).toMatchObject({ message: 'There is no logs to delete' })
  })

  test('returns status code 500 when token is missing', async () => {
    const res = await request(app)
      .delete('/logs/all')
      .set('Authorization', 'Bearer ')

    expect(res.statusCode).toEqual(500)
    expect(res.body).toMatchObject({ error: { message: 'jwt must be provided' } })
  })

  test('returns status code 406 when token is not provided', async () => {
    const res = await request(app)
      .delete('/logs/all')

    expect(res.statusCode).toEqual(406)
    expect(res.body).toMatchObject({ error: 'Token not provided' })
  })

  test('returns status code 500 when token is invalid', async () => {
    const res = await request(app)
      .delete('/logs/all')
      .set('Authorization', 'Bearer um.token.qualquer')

    expect(res.statusCode).toEqual(500)
    expect(res.body).toMatchObject({ error: { message: 'invalid token' } })
  })
})

describe('The API on /logs/hard/:id endpoint at DELETE method should...', () => {
  beforeEach(async () => {
    await signUp(userSignup)
    await signIn(userSignin)
    await createLog(mockLogs.validLog)
  })

  afterEach(async () => {
    await syncDB()
  })

  test('returns status code 200 and a successfull message', async () => {
    const res = await request(app)
      .delete('/logs/hard/1')
      .set('Authorization', `Bearer ${authorization[0]}`)

    expect(res.statusCode).toEqual(200)
    expect(res.body).toMatchObject({ message: 'Log deleted forever, this cannot be undone.' })
  })

  test('returns status code 406 and a message when the log does not exist', async () => {
    const res = await request(app)
      .delete('/logs/hard/90')
      .set('Authorization', `Bearer ${authorization[0]}`)

    expect(res.statusCode).toEqual(406)
    expect(res.body).toMatchObject({ message: 'Log not existis.' })
  })

  test('returns status code 404 and an empty obj when log id is missing', async () => {
    const res = await request(app)
      .delete('/logs/hard')
      .set('Authorization', `Bearer ${authorization[0]}`)

    expect(res.statusCode).toEqual(404)
    expect(res.body).toEqual({})
  })

  test('returns status code 500 and a message of error when token is invalid', async () => {
    const res = await request(app)
      .delete('/logs/hard/1')
      .set('Authorization', 'Bearer um.token.qualquer')

    expect(res.statusCode).toEqual(500)
    expect(res.body).toMatchObject({ error: { message: 'invalid token' } })
  })

  test('returns status code 500 and a message of error when token is missing', async () => {
    const res = await request(app)
      .delete('/logs/hard/1')
      .set('Authorization', 'Bearer')

    expect(res.statusCode).toEqual(500)
    expect(res.body).toMatchObject({ error: { message: 'jwt must be provided' } })
  })

  test('return status 406 for make sure that there are no logs', async () => {
    await request(app)
      .delete('/logs/hard/1')
      .set('Authorization', `Bearer ${authorization[0]}`)
    const res = await request(app)
      .get('/users/logs')
      .set('Authorization', `Bearer ${authorization[0]}`)

    expect(res.statusCode).toEqual(406)
    expect(res.body).toEqual({ message: 'There is no logs recorded' })
  })
})

describe('The API on /logs/all/hard endpoint at DELETE method should...', () => {
  beforeEach(async () => {
    await signUp(userSignup)
    await signIn(userSignin)
  })

  afterEach(async () => {
    await syncDB()
  })

  test('returns status code 200 and a successfull message', async () => {
    await createLog(mockLogs.validLog)

    const res = await request(app)
      .delete('/logs/all/hard')
      .set('Authorization', `Bearer ${authorization[0]}`)

    expect(res.statusCode).toEqual(200)
    expect(res.body).toMatchObject({ message: 'All logs deleted forever, this cannot be undone.' })
  })

  test('returns status code 406 when there is no log to delete', async () => {
    const res = await request(app)
      .delete('/logs/all/hard')
      .set('Authorization', `Bearer ${authorization[0]}`)

    expect(res.statusCode).toEqual(406)
    expect(res.body).toMatchObject({ message: 'There is no logs to delete' })
  })

  test('returns status code 500 when token is missing', async () => {
    const res = await request(app)
      .delete('/logs/all/hard')
      .set('Authorization', 'Bearer ')

    expect(res.statusCode).toEqual(500)
    expect(res.body).toMatchObject({ error: { message: 'jwt must be provided' } })
  })

  test('returns status code 406 when token is not provided', async () => {
    const res = await request(app)
      .delete('/logs/all/hard')

    expect(res.statusCode).toEqual(406)
    expect(res.body).toMatchObject({ error: 'Token not provided' })
  })

  test('returns status code 500 when token is invalid', async () => {
    const res = await request(app)
      .delete('/logs/all/hard')
      .set('Authorization', 'Bearer um.token.qualquer')

    expect(res.statusCode).toEqual(500)
    expect(res.body).toMatchObject({ error: { message: 'invalid token' } })
  })

  test('return status 406 for make sure that there are no logs', async () => {
    await createLog(mockLogs.validLog)
    await createLog(mockLogs.validLog)
    await request(app)
      .delete('/logs/all/hard')
      .set('Authorization', `Bearer ${authorization[0]}`)
    const res = await request(app)
      .get('/users/logs')
      .set('Authorization', `Bearer ${authorization[0]}`)

    expect(res.statusCode).toEqual(406)
    expect(res.body).toEqual({ message: 'There is no logs recorded' })
  })
})
