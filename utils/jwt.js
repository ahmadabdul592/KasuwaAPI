const jwt = require('jsonwebtoken')

const createJwt = ({payload}) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1d'
    })
    return token
}

const isTokenValid = ({token}) => jwt.verify(token, "jcdniuhoiewof49302idkwnfie")


const attachCookiesToResponse = ({res, user}) => {
    const token = createJwt({payload:user})
    const oneDay = 1000 * 60 * 60 * 24
    res.cookie('accessToken', token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure:process.env.NODE_ENV === 'production',
        signed: true
    })
}

module.exports = {
    createJwt,
    isTokenValid,
    attachCookiesToResponse
}