const {isTokenValid} = require('../utils')
const customError = require('../errors')
const {StatusCodes} = require('http-status-codes')



const auth = (req, res, next) => {

    const token = req.signedCookies.accessToken
   // console.log(token);
    if(!token){
        throw new customError.UnauthenticatedError('authentication invalid')
    }

    try {
        const {name, userId, role} = isTokenValid({token})
        req.user = {name, userId, role}
        next()
    } catch (error) {
        throw new customError.UnauthenticatedError('authentication invalid')
    }
    
}

const authorizePermissions  = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            throw new customError.UnauthorizedError('unAuthourize to acesss this route')
        }
        next()
    }
}


module.exports = {auth, authorizePermissions}