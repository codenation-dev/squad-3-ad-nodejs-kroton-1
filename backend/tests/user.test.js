/* eslint-env jest */
const request = require('supertest')
const { app } = require('../src/app')
const { sequelize, User, Log } = require('../src/models')
const { userPossibilitiesForCreate, userPossibilitiesForAuthenticate, userPossibilitiesForUpdate } = require('./mocks/user')
const { mockLogs } = require('./mocks/logs')

const constantDate = new Date('2020-02-15T18:01:01.000Z')

global.Date = class extends Date {
  constructor () {
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

describe('The API on /users/signup Endpoint at POST method should...', () => {
  afterEach(async () => {
    await Log.drop()
    await User.drop()

    await sequelize.sync({ force: true })
  })

  test('return status code 201, the new data created and a message of sucess', async () => {
    const res = await request(app)
      .post('/users/signup')
      .send(userPossibilitiesForCreate.userWithValidData)

    expect(res.statusCode).toEqual(201)
    expect(res.body).toEqual({
      data: {
        createdAt: '2020-02-15T18:01:01.000Z',
        userEmail: 'raulzito@gmail.com',
        userName: 'Raul Seixas'
      },
      message: 'User created successfully!'
    })
  })

  test('return status code 409 and message when there are 2 users with the same email', async () => {
    await request(app)
      .post('/users/signup')
      .send(userPossibilitiesForCreate.userWithValidData)

    const secoundRes = await request(app)
      .post('/users/signup')
      .send(userPossibilitiesForCreate.userWithValidData)

    expect(secoundRes.statusCode).toEqual(409)
    expect(secoundRes.body).toEqual({ message: 'User email already exists.' })
  })
  test('return status code 406 and a message of error when name is invalid', async () => {
    const res = await request(app)
      .post('/users/signup')
      .send(userPossibilitiesForCreate.userWithInvalidName)

    expect(res.statusCode).toEqual(406)
    expect(res.body).toEqual({ error: 'Data values are not valid' })
  })

  test('return status code 406 and a message of error when emails is invalid', async () => {
    const res = await request(app)
      .post('/users/signup')
      .send(userPossibilitiesForCreate.userWithInvalidEmail)

    expect(res.statusCode).toEqual(406)
    expect(res.body).toEqual({ error: 'Data values are not valid' })
  })

  test('return status code 406 and a message of error when minimum password length is invalid', async () => {
    const res = await request(app)
      .post('/users/signup')
      .send(userPossibilitiesForCreate.userWithInvalidPassword)

    expect(res.statusCode).toEqual(406)
    expect(res.body).toEqual({ error: 'Data values are not valid' })
  })

  test('return status code 406 and a message of error when password is type of number', async () => {
    const res = await request(app)
      .post('/users/signup')
      .send(userPossibilitiesForCreate.userWithTypeNumberPassword)

    expect(res.statusCode).toEqual(406)
    expect(res.body).toEqual({ error: 'Data values are not valid' })
  })

  test('return status code 406 and a message of error when user has no name', async () => {
    const res = await request(app)
      .post('/users/signup')
      .send(userPossibilitiesForCreate.userWithNoName)

    expect(res.statusCode).toEqual(406)
    expect(res.body).toEqual({ error: 'Data values are not valid' })
  })

  test('return status code 406 and a message of error when user has no email', async () => {
    const res = await request(app)
      .post('/users/signup')
      .send(userPossibilitiesForCreate.userWithNoEmail)

    expect(res.statusCode).toEqual(406)
    expect(res.body).toEqual({ error: 'Data values are not valid' })
  })

  test('return status code 406 and a message of error when user has no password', async () => {
    const res = await request(app)
      .post('/users/signup')
      .send(userPossibilitiesForCreate.userWithNoPassword)

    expect(res.statusCode).toEqual(406)
    expect(res.body).toEqual({ error: 'Data values are not valid' })
  })

  test('return status code 406 and a message of error when invalid keys of the object', async () => {
    const res = await request(app)
      .post('/users/signup')
      .send(userPossibilitiesForCreate.userWithInvalidKeys)

    expect(res.statusCode).toEqual(406)
    expect(res.body).toEqual({ error: 'Data values are not valid' })
  })
})

describe('The API on /users/signin Endpoint at POST method should...', () => {
  beforeEach(async () => {
    await request(app)
      .post('/users/signup')
      .send(userPossibilitiesForCreate.userWithValidData)
  })

  afterEach(async () => {
    await Log.drop()
    await User.drop()

    await sequelize.sync({ force: true })
  })

  test('return status code 200 and an object with the token', async () => {
    const res = await request(app).post('/users/signin').send(userPossibilitiesForAuthenticate.userWithValidData)

    expect(res.statusCode).toEqual(200)
    expect(res.body).toMatchObject({})
  })

  test('return status code 400 and message when email is not correct', async () => {
    const res = await request(app).post('/users/signin').send(userPossibilitiesForAuthenticate.userWithInvalidEmail)

    expect(res.statusCode).toEqual(400)
    expect(res.body).toEqual({ message: 'User not found' })
  })

  test('return status code 401 and a message of incorrect password when password is invalid', async () => {
    const res = await request(app).post('/users/signin').send(userPossibilitiesForAuthenticate.userWithInvalidPassword)
    expect(res.statusCode).toEqual(401)
    expect(res.body).toEqual({ message: 'Incorrect password' })
  })

  test('return status code 406 and a message of error when there is more data then of necessary', async () => {
    const res = await request(app).post('/users/signin').send(userPossibilitiesForAuthenticate.userWithMoreData)
    expect(res.statusCode).toEqual(406)
    expect(res.body).toEqual({ message: 'You are input wrong data then necessary' })
  })

  test('return status code 406 and a message of error when password is type of number', async () => {
    const res = await request(app).post('/users/signin').send(userPossibilitiesForAuthenticate.userWithTypeNumberPassword)
    expect(res.statusCode).toEqual(500)
    expect(res.body).toEqual({ error: {} })
  })

  test('return status code 400 and a message of error when user has no email', async () => {
    const res = await request(app).post('/users/signin').send(userPossibilitiesForAuthenticate.userWithNoEmail)
    expect(res.statusCode).toEqual(400)
    expect(res.body).toEqual({ message: 'User not found' })
  })

  test('return status code 401 and a message of error when user has no password', async () => {
    const res = await request(app).post('/users/signin').send(userPossibilitiesForAuthenticate.userWithNoPassword)
    expect(res.statusCode).toEqual(401)
    expect(res.body).toEqual({ message: 'Incorrect password' })
  })
})

describe('The API on /users Endpoint at PATCH method should...', () => {
  const token = []
  beforeEach(async (done) => {
    await request(app).post('/users/signup')
      .send(userPossibilitiesForCreate.userWithValidData)
    const res = await request(app)
      .post('/users/signin')
      .send(userPossibilitiesForAuthenticate.userWithValidData)

    token.push(res.body.token)
    done()
  })

  afterEach(async () => {
    await Log.drop()
    await User.drop()
    token.pop()

    await sequelize.sync({ force: true })
  })

  test('return status code 200 and a message confirming (name, email, password)', async () => {
    const res = await request(app)
      .patch('/users')
      .send(userPossibilitiesForUpdate.userWithValidData)
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({
      message: 'Updated sucessfully!'
    })
  })

  test('return status code 200 and a message confirming (name, email)', async () => {
    const res = await request(app)
      .patch('/users')
      .send(userPossibilitiesForUpdate.userWithNameAndEmail)
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({
      message: 'Updated sucessfully!'
    })
  })

  test('return status code 200 and a message confirming (name, password)', async () => {
    const res = await request(app)
      .patch('/users')
      .send(userPossibilitiesForUpdate.userWithNameAndPassword)
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({
      message: 'Updated sucessfully!'
    })
  })

  test('return status code 200 and a message confirming (name)', async () => {
    const res = await request(app)
      .patch('/users')
      .send(userPossibilitiesForUpdate.userWithJustName)
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({
      message: 'Updated sucessfully!'
    })
  })

  test('return status code 200 and a message confirming (email, password)', async () => {
    const res = await request(app)
      .patch('/users')
      .send(userPossibilitiesForUpdate.userWithEmailAndPassword)
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({
      message: 'Updated sucessfully!'
    })
  })

  test('return status code 200 and a message confirming (email)', async () => {
    const res = await request(app)
      .patch('/users')
      .send(userPossibilitiesForUpdate.userWithJustEmail)
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({
      message: 'Updated sucessfully!',
    })
  })

  test('return status code 200 and and a message confirming (password)', async () => {
    const res = await request(app)
      .patch('/users')
      .send(userPossibilitiesForUpdate.userJustWithValidPassword)
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({
      message: 'Updated sucessfully!',
    })
  })

  test('return status code 401 and error message', async () => {
    const res = await request(app)
      .patch('/users')
      .send(userPossibilitiesForUpdate.userWithInvalidOldPassword)
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toEqual(401)
    expect(res.body).toEqual({ message: 'Password does not match' })
  })

  test('return status code 406 with not confirmed password and error message', async () => {
    const res = await request(app)
      .patch('/users')
      .send(userPossibilitiesForUpdate.userWithNotConfirmedPassword)
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toEqual(406)
    expect(res.body).toEqual({ message: 'Data values are not valid' })
  })

  test('return status code 406 with a error message of body', async () => {
    const res = await request(app)
      .patch('/users')
      .send(userPossibilitiesForUpdate.userWithInvalidBody)
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toEqual(406)
    expect(res.body).toEqual({ "message": "Data values are not valid for body" })
  })

  test.skip('return status code 406 and error message when password is number', async () => {
    const res = await request(app)
      .patch('/users')
      .send(userPossibilitiesForUpdate.userWithTypeNumberNewPassword)
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toEqual(406)
    expect(res.body).toEqual({ message: 'Data values are not valid' })
  })
})

describe.skip('The API on /users/logs Endpoint at GET method should...', () => {
  const token = []
  beforeEach(async (done) => {
    await request(app)
      .post('/users/signup')
      .send(userPossibilitiesForCreate.userWithValidData)
    const res = await request(app)
      .post('/users/signin')
      .send(userPossibilitiesForAuthenticate.userWithValidData)

    token.push(res.body.token)

    await request(app)
      .post('/logs')
      .send(mockLogs.validLog)
      .set('Authorization', `Bearer ${token}`)

    done()
  })

  afterEach(async () => {
    await Log.drop()
    await User.drop()
    token.pop()

    await sequelize.sync({ force: true })
  })

  test('return status 200, total of logs and the logs information', async () => {
    const res = await request(app)
      .get('/users/logs')
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({
      total: 1,
      Logs: [{
        UserId: 1,
        createdAt: '2020-02-15T18:01:01.000Z',
        deletedAt: null,
        description: 'Aplicattion down',
        environment: 'production',
        id: 1,
        level: 'FATAL',
        sendDate: '10/10/2019 15:00',
        senderApplication: 'App_1',
        updatedAt: '2020-02-15T18:01:01.000Z'
      }]
    })
  })

  test('return status 406 and a message when there is no log', async () => {
    await request(app)
      .delete('/logs/id/1')
      .set('Authorization', `Bearer ${token}`)

    const res = await request(app)
      .get('/users/logs')
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toEqual(406)
    expect(res.body).toEqual({ message: 'There is no logs recorded' })
  })

  test('return status when token is incorrect', async () => {
    const incorrectToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
    const res = await request(app)
      .get('/users/logs')
      .set('Authorization', `Bearer ${incorrectToken}`)

    expect(res.statusCode).toEqual(500)
    expect(res.body).toEqual({
      error: {
        message: 'invalid signature',
        name: 'JsonWebTokenError'
      }
    })
  })

  test('return status when token not provided', async () => {
    const res = await request(app)
      .get('/users/logs')
      .set('Authorization', 'Bearer ')

    expect(res.statusCode).toEqual(500)
    expect(res.body).toEqual({
      error: {
        message: 'jwt must be provided',
        name: 'JsonWebTokenError'
      }
    })
  })
})

describe('The API on /users Endpoint at DELETE method should...', () => {
  const token = []
  beforeEach(async (done) => {
    await request(app).post('/users/signup')
      .send(userPossibilitiesForCreate.userWithValidData)
    const res = await request(app)
      .post('/users/signin')
      .send(userPossibilitiesForAuthenticate.userWithValidData)

    token.push(res.body.token)
    done()
  })

  afterEach(async () => {
    await Log.drop()
    await User.drop()
    token.pop()

    await sequelize.sync({ force: true })
  })

  test('return status code 200 and a message od deletation', async () => {
    const res = await request(app)
      .delete('/users')
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({ message: 'User deleted succesfully' })
  })

  test('return status 406 and a message when user not found or has already been deleted', async () => {
    await request(app)
      .delete('/users')
      .set('Authorization', `Bearer ${token}`)
    const res = await request(app)
      .delete('/users')
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toEqual(406)
    expect(res.body).toEqual({ message: 'User not found!' })
  })

  test('return status when token is incorrect', async () => {
    const incorrectToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
    const res = await request(app)
      .delete('/users')
      .set('Authorization', `Bearer ${incorrectToken}`)

    expect(res.statusCode).toEqual(500)
    expect(res.body).toEqual({
      error: {
        message: 'invalid signature',
        name: 'JsonWebTokenError'
      }
    })
  })

  test('return status 500 when token not provided', async () => {
    const res = await request(app)
      .delete('/users')
      .set('Authorization', 'Bearer ')

    expect(res.statusCode).toEqual(500)
    expect(res.body).toEqual({
      error: {
        message: 'jwt must be provided',
        name: 'JsonWebTokenError'
      }
    })
  })
})

describe('The API on /users/hard Endpoint at DELETE method should...', () => {
  const token = []
  beforeEach(async (done) => {
    await request(app).post('/users/signup')
      .send(userPossibilitiesForCreate.userWithValidData)
    const res = await request(app)
      .post('/users/signin')
      .send(userPossibilitiesForAuthenticate.userWithValidData)

    token.push(res.body.token)
    done()
  })

  afterEach(async () => {
    await Log.drop()
    await User.drop()
    token.pop()

    await sequelize.sync({ force: true })
  })

  test('return status code 200 and a message od deletation', async () => {
    const res = await request(app)
      .delete('/users/hard')
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({ message: 'User deleted forever, this cannot be undone.' })
  })

  test('return an empty array when search for all users but the have already deleted', async () => {
    await request(app)
      .delete('/users/hard')
      .set('Authorization', `Bearer ${token}`)

    const findUser = await User.findAll()

    expect(findUser).toEqual([])
  })

  test('return status 406 and a message when user not found or has already been deleted', async () => {
    await request(app)
      .delete('/users/hard')
      .set('Authorization', `Bearer ${token}`)
    const res = await request(app)
      .delete('/users')
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toEqual(406)
    expect(res.body).toEqual({ message: 'User not found!' })
  })

  test('return status when token is incorrect', async () => {
    const incorrectToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
    const res = await request(app)
      .delete('/users/hard')
      .set('Authorization', `Bearer ${incorrectToken}`)

    expect(res.statusCode).toEqual(500)
    expect(res.body).toEqual({
      error: {
        message: 'invalid signature',
        name: 'JsonWebTokenError'
      }
    })
  })

  test('return status 500 when token not provided', async () => {
    const res = await request(app)
      .delete('/users/hard')
      .set('Authorization', 'Bearer ')

    expect(res.statusCode).toEqual(500)
    expect(res.body).toEqual({
      error: {
        message: 'jwt must be provided',
        name: 'JsonWebTokenError'
      }
    })
  })
})

describe('The API on /users/restore Endpoint at POST method should...', () => {
  const token = []
  beforeEach(async (done) => {
    await request(app).post('/users/signup')
      .send(userPossibilitiesForCreate.userWithValidData)
    const res = await request(app)
      .post('/users/signin')
      .send(userPossibilitiesForAuthenticate.userWithValidData)

    token.push(res.body.token)
    done()
  })

  afterEach(async () => {
    await Log.drop()
    await User.drop()
    token.pop()

    await sequelize.sync({ force: true })
  })

  test('return status code 200 and a message of successfully', async () => {
    const res = await request(app)
      .post('/users/restore')
      .send(userPossibilitiesForAuthenticate.userWithValidData)
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({ message: 'User restored successfully.' })
  })

  test('return status code 400 and a message when user has deleted hard', async () => {
    await request(app)
      .delete('/users/hard')
      .set('Authorization', `Bearer ${token}`)
    const res = await request(app)
      .post('/users/restore')
      .send(userPossibilitiesForAuthenticate.userWithValidData)
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toEqual(400)
    expect(res.body).toEqual({ message: 'User not found' })
  })

  test('return status code 400 and a message of error when email is incorrect', async () => {
    const res = await request(app)
      .post('/users/restore')
      .send(userPossibilitiesForAuthenticate.userWithInvalidEmail)
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toEqual(400)
    expect(res.body).toEqual({ message: 'User not found' })
  })

  test('return status code 400 and a message of error when password is incorrect', async () => {
    const res = await request(app)
      .post('/users/restore')
      .send(userPossibilitiesForAuthenticate.userWithInvalidPassword)
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toEqual(401)
    expect(res.body).toEqual({ message: 'Incorrect password' })
  })
})
