/* eslint-env jest */
const request = require('supertest')
const { app } = require('../src/app')
const { sequelize, User, Log } = require('../src/models')
const { userPossibilitiesForCreate, userPossibilitiesForAuthenticate } = require('./mocks/user')
const { authenticate } = require('../src/middlewares/auth')

jest.mock('authenticate')

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

describe.skip('The API on /users/signup Endpoint at POST method should...', () => {
  afterEach(async () => {
    await User.destroy({
      truncate: true
    })
  })

  test('return status code 201, the new data created and a message of sucess', async () => {
    const res = await request(app).post('/users/signup').send(userPossibilitiesForCreate.userWithValidData)
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
    const res = await request(app).post('/users/signup').send(userPossibilitiesForCreate.userWithValidData)
    const secoundRes = await request(app).post('/users/signup').send(userPossibilitiesForCreate.userWithValidData)
    expect(secoundRes.statusCode).toEqual(409)
    expect(secoundRes.body).toEqual({ message: 'User email already exists.' })
  })
  test('return status code 406 and a message of error when name is invalid', async () => {
    const res = await request(app).post('/users/signup').send(userPossibilitiesForCreate.userWithInvalidName)
    expect(res.statusCode).toEqual(406)
    expect(res.body).toEqual({ error: 'Data values are not valid' })
  })

  test('return status code 406 and a message of error when emails is invalid', async () => {
    const res = await request(app).post('/users/signup').send(userPossibilitiesForCreate.userWithInvalidEmail)
    expect(res.statusCode).toEqual(406)
    expect(res.body).toEqual({ error: 'Data values are not valid' })
  })

  test('return status code 406 and a message of error when minimum password length is invalid', async () => {
    const res = await request(app).post('/users/signup').send(userPossibilitiesForCreate.userWithInvalidPassword)
    expect(res.statusCode).toEqual(406)
    expect(res.body).toEqual({ error: 'Data values are not valid' })
  })

  test('return status code 406 and a message of error when password is type of number', async () => {
    const res = await request(app).post('/users/signup').send(userPossibilitiesForCreate.userWithTypeNumberPassword)
    expect(res.statusCode).toEqual(406)
    expect(res.body).toEqual({ error: 'Data values are not valid' })
  })

  test('return status code 406 and a message of error when user has no name', async () => {
    const res = await request(app).post('/users/signup').send(userPossibilitiesForCreate.userWithNoName)
    expect(res.statusCode).toEqual(406)
    expect(res.body).toEqual({ error: 'Data values are not valid' })
  })

  test('return status code 406 and a message of error when user has no email', async () => {
    const res = await request(app).post('/users/signup').send(userPossibilitiesForCreate.userWithNoEmail)
    expect(res.statusCode).toEqual(406)
    expect(res.body).toEqual({ error: 'Data values are not valid' })
  })

  test('return status code 406 and a message of error when user has no password', async () => {
    const res = await request(app).post('/users/signup').send(userPossibilitiesForCreate.userWithNoPassword)
    expect(res.statusCode).toEqual(406)
    expect(res.body).toEqual({ error: 'Data values are not valid' })
  })
})

describe('The API on /users/signin Endpoint at POST method should...', () => {
  beforeEach(async () => {
    const res = await request(app).post('/users/signup').send({
      name: 'Raul Seixas',
      email: 'raulzito@gmail.com',
      password: '123456'
    })
  })
  afterEach(async () => {
    /* await Log.destroy({
      truncate: true
    }) */
    await User.destroy({
      truncate: true
    })
  })

  test.skip('return status code 200 and an object with the token', async () => {
    const res = await request(app).post('/users/signin').send(userPossibilitiesForAuthenticate.userWithValidData)

    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({
      token: ''
    })
  })

  test('return status code 400 and message when email is not correct', async () => {
    const res = await request(app).post('/users/signin').send(userPossibilitiesForAuthenticate.userWithInvalidEmail)

    expect(res.statusCode).toEqual(400)
    expect(res.body).toEqual({ message: 'User not found' })
  })

  test('return status code 401 and a message of incorrect password when password is invalid', async () => {
    const res = await request(app).post('/users/signin').send(userPossibilitiesForAuthenticate.userWithInvalidPassword)
    expect(res.statusCode).toEqual(401)
    expect(res.body).toEqual({ message: 'Incorrect password.' })
  })

  test('return status code 406 and a message of error when there is more data then of necessary', async () => {
    const res = await request(app).post('/users/signin').send(userPossibilitiesForAuthenticate.userWithMoreData)
    expect(res.statusCode).toEqual(406)
    expect(res.body).toEqual({ message: 'You are input more data then necessary' })
  })

  test('return status code 406 and a message of error when password is type of number', async () => {
    const res = await request(app).post('/users/signin').send(userPossibilitiesForAuthenticate.userWithTypeNumberPassword)
    expect(res.statusCode).toEqual(406)
    expect(res.body).toEqual({ message: 'Password must be a string.' })
  })

  test('return status code 400 and a message of error when user has no email', async () => {
    const res = await request(app).post('/users/signin').send(userPossibilitiesForAuthenticate.userWithNoEmail)
    expect(res.statusCode).toEqual(400)
    expect(res.body).toEqual({ message: 'User not found' })
  })

  test('return status code 401 and a message of error when user has no password', async () => {
    const res = await request(app).post('/users/signin').send(userPossibilitiesForAuthenticate.userWithNoPassword)
    expect(res.statusCode).toEqual(401)
    expect(res.body).toEqual({ message: 'Incorrect password.' })
  })
})
