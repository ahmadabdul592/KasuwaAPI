const { required } = require('joi')
const mongoose = require('mongoose')

const singleOrderItemSchema = mongoose.Schema({
    name: {type:String, required: true},
    image: {type:String, required: true},
    price: {type:Number, required: true},
    amount: {type:Number, required: true},
    product:{
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Product'
    }
})


const orderSchema = new mongoose.Schema({
    tax: {
        type: Number,
        required: true
    },
    shippingFee: {
        type:Number,
        required: true
    },
    subtotal: {
        type: Number,
        required: true
    },
    total:{
        type:Number,
        required: true
    },
    orderItems: [singleOrderItemSchema],
    status:{
        type: String,
        enum: ['pending', 'decline', 'paid'],
        default: 'pending'
    },
    user: {
        type:mongoose.Schema.ObjectId,
        required: true,
        ref: 'User'
    },
    clientSecret: {
        type: String
    },
    paymentIntent: {
       type: String
    },

},{timestamps: true})


module.exports = mongoose.model('Order', orderSchema)