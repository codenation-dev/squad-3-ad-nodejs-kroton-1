const userPossibilities = {
  userWithValidData: {
    name: 'Raul Seixas',
    email: 'raulzito@gmail.com',
    password: '123456'
  },
  userWithInvalidName: {
    name: 123,
    email: 'raulzitogmail.com',
    password: '123456'
  },
  userWithInvalidEmail: {
    name: 'Raul Seixas',
    email: 'raulzitogmail.com',
    password: '123456'
  },
  userWithInvalidPassword: {
    name: 'Raul Seixas',
    email: 'raulzito@gmail.com',
    password: '12345'
  },
  userWithTypeNumberPassword: {
    name: 'Raul Seixas',
    email: 'raulzito@gmail.com',
    password: 12345
  },
  userWithNoName: {
    name: '',
    email: 'raulzito@gmail.com',
    password: '12345'
  },
  userWithNoEmail: {
    name: '',
    email: 'raulzito@gmail.com',
    password: '12345'
  },
  userWithNoPassword: {
    name: '',
    email: 'raulzito@gmail.com',
    password: '12345'
  }
}

module.exports = { userPossibilities }
