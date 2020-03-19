/* eslint-env jest */
const request = require('supertest')
const { app } = require('../src/app')
const { sequelize, User, Log } = require('../src/models')

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
  const user = {
    name: 'user test',
    email: 'user_test@gmail.com',
    password: '123456'
  }
  const log = {
    level: 'FATAL',
    description: 'Aplicattion down',
    senderApplication: 'App_1',
    sendDate: '10/10/2019 15:00',
    environment: 'production'
  }
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
    await request(app).post('/users/signup').send(user)
    const { body: { token } } = await request(app).post('/users/signin').send({ email: user.email, password: user.password })
    authorization.push(token)
  })
  afterEach(async () => {
    await Log.destroy({
      truncate: true
    })
    await User.destroy({
      truncate: true
    })
  })

  test('return 200 as status code and the new token generated', async () => {
    const res = await request(app).post('/logs').send(log).set('Authorization', `Bearer ${authorization[0]}`)
    expect(res.body).toMatchObject(expected)
    expect(res.statusCode).toEqual(200)
  })

  test('return 401 as status code for a given user or password invalid', async () => {
    // ...
  })
})
