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
  },
  userWithInvalidKeys: {
    name: 'Raul Seixas',
    mail: 'raulzito@gmail.com',
    password: '123456'
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

const userPossibilitiesForUpdate = {
  userWithValidData: {
    name: 'New Raul Seixas',
    email: 'raulzito123@gmail.com',
    oldPassword: '123456',
    newPassword: '12345678',
    confirmPassword: '12345678'
  },

  userWithNameAndEmail: {
    name: 'New Raul Seixas',
    email: 'raulzito123@gmail.com'
  },

  userWithNameAndPassword: {
    name: 'New Raul Seixas',
    oldPassword: '123456',
    newPassword: '12345678',
    confirmPassword: '12345678'
  },

  userWithJustName: {
    name: 'New Raul Seixas'
  },

  userWithEmailAndPassword: {
    email: 'raulzito123@gmail.com',
    oldPassword: '123456',
    newPassword: '12345678',
    confirmPassword: '12345678'
  },

  userWithJustEmail: {
    email: 'raulzito123@gmail.com'
  },

  userJustWithValidPassword: {
    oldPassword: '123456',
    newPassword: '12345678',
    confirmPassword: '12345678'
  },

  userWithInvalidOldPassword: {
    oldPassword: '123456789',
    newPassword: '12345678',
    confirmPassword: '12345678'
  },

  userWithNotConfirmedPassword: {
    oldPassword: '12345678',
    newPassword: '12345678',
    confirmPassword: ''
  },

  userWithTypeNumberNewPassword: {
    oldPassword: '123456',
    newPassword: 12345678,
    confirmPassword: '12345678'
  },

  userWithInvalidBody: {
    ame: 'New Raul Seixas',
    email: 'raulzito123@gmail.com',
    oldPassword: '123456',
    newPassword: '12345678',
    confirmPassword: '12345678'
  }
}
module.exports = {
  userPossibilitiesForCreate,
  userPossibilitiesForAuthenticate,
  userPossibilitiesForUpdate
}
