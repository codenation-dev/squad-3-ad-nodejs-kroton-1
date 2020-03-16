const { User } = require('../models')
const {generateToken } = require('../services/auth')

module.exports = {

    authenticate: async (req, res, next) => {
        try {
            const { body: { email, password } } = req;

            const user = await User.findOne({
                where: {
                    email
                }
            });

            if (user) {
                if (user.email === email && user.password === password) {
                    const token = generateToken({
                        id: user.id
                    })
                    res.status(200).json({
                        token
                    })
                } else {
                    res.status(401).json({
                        message: 'User or password incorrect'
                    })
                }
            } else {
                res.status(400).json({
                    message: 'User not found'
                })
            }
        } catch (error) {
            res.status(400).json({ error })
        }
    },

/*     authorize: async (req, res, next) => {
        try {
            const token = 
        }
    } */

}