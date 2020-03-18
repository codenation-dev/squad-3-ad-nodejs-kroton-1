const yup = require('yup');
const bcrypt = require("bcryptjs");

module.exports = {
  schemaValidation: () => {
    const schema =
      yup.object().shape({
        name: yup.string().required(),
        email: yup.string().required().email(),
        password: yup.string().required().min(6)
      })
    return schema;
  },

  schemaValidationForCheckPassword: () => {
    const schema = yup.object().shape({
      name: yup.string(),
      email: yup.string().email(),
      oldPassword: yup.string().min(6),
      newPassword: yup.string().min(6).when('oldPassword', (oldPassword, field) => {
          return oldPassword ? field.required() : field; // se a var oldPassword for true, o field fica required. Field refere-se ao password (nao ao oldPass).
      }),
      confirmPassword: yup.string().when('newPassword', (password, field) => {
          return password ? field.required().oneOf([yup.ref('newPassword')]) : field; //  required().oneOf([])requere um dos campos que estão no array. Yup.ref se refere a outro campo. No caso garante que o campo confirmPassword seja igual ao password
      })
  });
    return schema;
  },

  generateHashedPassword: async (password) => {
    //console.log(password)
    const hash = await bcrypt.hash(password, 8);

    return hash
  },

  compareHash: async (password, hash) => {
    
    const comparedHash = await bcrypt.compare(password, hash)
    
    return comparedHash
  }
}
