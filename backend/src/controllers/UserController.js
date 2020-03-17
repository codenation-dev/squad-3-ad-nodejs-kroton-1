const { User } = require('../models')
const { Log } = require('../models')
const { schemaValidation, schemaValidationForCheckPassword, generateHashedPassword, compareHash } = require('../utils/helpers')
const { decodeToken } = require('../services/auth');

module.exports = {
  create: async (req, res, next) => {
    const { body: { name, email, password } } = req

    if (!(await schemaValidation().isValid({
      name,
      email,
      password
    }))) {
      return res.status(400).json({ error: 'Email or name not valid' });
    }

    const existsEmail = await User.findOne({
      where:
      {
        email
      }
    });

    if (existsEmail) {
      return res.status(400).json({ message: 'User email already existis.' });
    }

    try {

      const user = await User.create({
        name,
        email,
        password: await generateHashedPassword(password)
      })

      res.status(200).json({ user })

    } catch (error) {
      res.status(400).json({ error })
    }
  },

  update: async (req, res, next) => {
    const { body: { name, email, oldPassword, password, confirmPassword } } = req
    
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    const { userId: {id} } = decodeToken(token)

    // diferente da validação p/ create, aqui só vai ser required o password se o user informar o oldPassword, o que significa que ele quer alterar a senha
    // assim damos o when (uma valid condicional) para obrigar o user mudar a senha caso informe o oldPassword
    if(!(await schemaValidationForCheckPassword().isValid({
      name,
      email,
      oldPassword,
      password,
      confirmPassword
    }))) {
      return res.status(400).json({ error: 'Validation fail' });
    }

    const user = await User.findOne({
      where: {
        id
      }
    });

    // somente verifica caso esteja mudando de email
    
    if(email !== user.email) {
        const existsEmail = await User.findOne({
            where:
            {
                email
            }
        });
        if(existsEmail) {
            return res.status(400).json({ message: 'User email already existis.' });
        }
    }
    
    // verifica se a senha antiga bate com a senha atual, mas somente se estiver querendo mudar de senha por isso o &&
    if(oldPassword && !(await compareHash(oldPassword, user.password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    try {
      const userUpdated = await User.update({
        name,
        email,
        password
      }, {
        where: {
          id
        }
      })

      res.status(200).json({ data: userUpdated, message: 'user updated!' })
    } catch (error) {
      res.status(400).json({ error })
    }
  },

  deleteById: async (req, res, next) => {
    const { id } = req.params
    try {
      await User.destroy({
        where: { id }
      })
      res.status(200).json({ message: 'user deleted succesfully' })
    } catch (error) {
      res.status(400).json({ error })
    }
  }
}