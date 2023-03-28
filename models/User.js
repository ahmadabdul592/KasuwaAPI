const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please provide name'],
        minlenght: 3,
        maxlenght: 50
    },
    email: {
        type: String,
        required: [true, 'please provide email'],
        unique:true,
        validate: {
            validator: validator.isEmail,
            message: 'please provide a valid email'
        }
    },
    password: {
        type: String,
        required: [true, 'please provide password'],
        minlenght: 6
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
})


userSchema.pre('save', async function(){
    if(this.isModified('password')){

        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
    }
})

userSchema.methods.comparePassword = async function(candidatesPassword){

    const isMatch = await bcrypt.compare(candidatesPassword, this.password)
    return isMatch
}


module.exports = mongoose.model('User', userSchema)