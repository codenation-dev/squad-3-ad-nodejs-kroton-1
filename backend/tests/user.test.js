/* eslint-env jest */
const request = require('supertest')
const { app } = require('../src/app')
const { sequelize, User, Log } = require('../src/models')
const { userPossibilities } = require('./mocks/user')

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

describe('The API on users/signup Endpoint at POST method should...', () => {
  afterEach(async () => {
    await Log.destroy({
      truncate: true
    })
    await User.destroy({
      truncate: true
    })
  })

  test('return status code 201, the new data created and a message of sucess', async () => {
    const res = await request(app).post('/users/signup').send(userPossibilities.userWithValidData)
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

  test('return status code 406 and a message of error when name is invalid', async () => {
    const res = await request(app).post('/users/signup').send(userPossibilities.userWithInvalidName)
    expect(res.statusCode).toEqual(406)
    expect(res.body).toEqual({ error: 'Data values are not valid' })
  })

  test('return status code 406 and a message of error when emails is invalid', async () => {
    const res = await request(app).post('/users/signup').send(userPossibilities.userWithInvalidEmail)
    expect(res.statusCode).toEqual(406)
    expect(res.body).toEqual({ error: 'Data values are not valid' })
  })

  test('return status code 406 and a message of error when minimum password length is invalid', async () => {
    const res = await request(app).post('/users/signup').send(userPossibilities.userWithInvalidPassword)
    expect(res.statusCode).toEqual(406)
    expect(res.body).toEqual({ error: 'Data values are not valid' })
  })

  test('return status code 406 and a message of error when password is type of number', async () => {
    const res = await request(app).post('/users/signup').send(userPossibilities.userWithTypeNumberPassword)
    expect(res.statusCode).toEqual(406)
    expect(res.body).toEqual({ error: 'Data values are not valid' })
  })

  test('return status code 406 and a message of error when user has no name', async () => {
    const res = await request(app).post('/users/signup').send(userPossibilities.userWithNoName)
    expect(res.statusCode).toEqual(406)
    expect(res.body).toEqual({ error: 'Data values are not valid' })
  })

  test('return status code 406 and a message of error when user has no email', async () => {
    const res = await request(app).post('/users/signup').send(userPossibilities.userWithNoEmail)
    expect(res.statusCode).toEqual(406)
    expect(res.body).toEqual({ error: 'Data values are not valid' })
  })

  test('return status code 406 and a message of error when user has no password', async () => {
    const res = await request(app).post('/users/signup').send(userPossibilities.userWithNoPassword)
    expect(res.statusCode).toEqual(406)
    expect(res.body).toEqual({ error: 'Data values are not valid' })
  })
})

/* describe.skip('The API on users/signup Endpoint at POST method should...', async () => {
  beforeEach(async () => {
    await User.create({
      name: 'João da Silva',
      email: 'joao@gmail.com',
      password: '123456'
    })
    await Log.create({
      level: 'FATAL',
      description: 'Aplicattion down',
      senderpplication: 'App_1',
      sendDate: '01/10/2020 15:30',
      environment: 'production'
    })
  })
  afterEach(async () => {
    await Log.destroy({
      truncate: true
    })
    await User.destroy({
      truncate: true
    })
  })
}) */
