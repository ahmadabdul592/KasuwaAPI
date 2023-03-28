const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const customError = require('../errors')
const {attachCookiesToResponse, createTokenUser} = require('../utils')


const register = async(req, res) => {

    const {name, email, password} = req.body;

    const isEmailAlreadyExist = await User.findOne({email})
    console.log({...req.body})
    if(isEmailAlreadyExist){
    
        throw new customError.BadRequestError('email already exist')
    }

    const isFirstAccount = await User.countDocuments({}) === 0;

    const role = isFirstAccount ? 'admin' : 'user'

    const user = await User.create({name, email, password, role})

    const tokenUser = createTokenUser({user})

    // const token = createJwt({payload: tokenUser})

    attachCookiesToResponse({res, user:tokenUser})

    res.status(StatusCodes.CREATED).json({user:tokenUser})
}

const login = async(req, res) => {
   
    const {email, password} = req.body;

    if(!email || !password){
        throw new customError.BadRequestError('please provide email and password')
    }

    const user = await User.findOne({email})

    if(!user){
        throw new customError.UnauthenticatedError('invalid credentials')
    }

    const isPasswordCorrect = await user.comparePassword(password)

    if(!isPasswordCorrect){
        throw new customError.UnauthenticatedError('invalid credentials')
    }

    const tokenUser = createTokenUser({user})
    attachCookiesToResponse({res, user: tokenUser })

    res.status(StatusCodes.OK).json({user:tokenUser})

}


const logout = (req, res) => {
    
    res.cookie('accessToken', '', {
        httpOnly: true,
        expires: new Date(Date.now())
    })

    res.status(StatusCodes.OK).json({messg: 'logout successful'})
}


module.exports = {
    register,
    login,
    logout
}