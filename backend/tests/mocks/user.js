const userPossibilitiesForCreate = {
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
    name: 'Raul Seixas',
    email: '',
    password: '12345'
  },
  userWithNoPassword: {
    name: '',
    email: 'raulzito@gmail.com',
    password: ''
  }
}

const userPossibilitiesForAuthenticate = {
  userWithValidData: {
    email: 'raulzito@gmail.com',
    password: '123456'
  },
  userWithMoreData: {
    name: 'Raul Seixas',
    email: 'raulzito@gmail.com',
    password: '123456'
  },
  userWithInvalidEmail: {
    email: 'raulzitogmail.com',
    password: '123456'
  },
  userWithInvalidPassword: {
    email: 'raulzito@gmail.com',
    password: '12345'
  },
  userWithTypeNumberPassword: {
    email: 'raulzito@gmail.com',
    password: 12345
  },
  userWithNoEmail: {
    email: '',
    password: '12345'
  },
  userWithNoPassword: {
    email: 'raulzito@gmail.com',
    password: ''
  }
}

module.exports = { userPossibilitiesForCreate, userPossibilitiesForAuthenticate }
