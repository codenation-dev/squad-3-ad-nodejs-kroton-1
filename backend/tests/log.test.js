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

  test('return 200 as status code and the new token generated', async () => {

    const user = {
      name: 'user test',
      email: 'user_test@gmail.com',
      password: '123456'
    }
    const res = await request(app).post('/users/signup').send(user)
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual('')
  })

  test('return 401 as status code for a given user or password invalid', async () => {
    // ...
  })
})
