const Order = require('../models/Order')
const Product = require('../models/Product')
const {StatusCodes} = require('http-status-codes')
const customError = require('../errors')
const { checkPermissions } = require('../utils')

const FakeStripeAPI = async({amount, currency}) => {{
    const Client_Secret = 'secret'
    return {Client_Secret}
}}

const createOrder = async(req, res) => {
    const {cartItems, tax, shippingFee} = req.body;

    if(!cartItems || cartItems.lenght < 1){
        throw new customError.BadRequestError('please provide cart items')
    }

    if(!shippingFee || !tax){
        throw new customError.BadRequestError('please provide shipping fee and tax')   
    }

    let orderItems = [];
    let subtotal = 0;

    for(const cartItem of cartItems){
        const dbProduct = await Product.findOne({_id: cartItem.product})

        if(!dbProduct){
            throw new customError.NotFoundError(`no product with id: ${dbProduct}`)
        }

        const {name, price, image, _id} = dbProduct;

        const singleOrderItem = {
            amount: cartItem.amount,
            name,
            price,
            image,
            product: _id
        }

        orderItems = [...orderItems, singleOrderItem]
        subtotal += cartItem.amount * price
    }
    const total = tax + shippingFee + subtotal

    const paymentIntent = await FakeStripeAPI({

        total,
        currency: 'usd'
    })
    const order = await Order.create({
        total,
        shippingFee,
        subtotal,
        tax,
        orderItems,
        clientSecret: paymentIntent.Client_Secret,
        user: req.user.userId
       })
    
        res.status(StatusCodes.CREATED).json({order, paymentIntent: order.clientSecret})

   }
   


const getAllOrders = async(req, res) => {
    const orders = await Order.find({})
    res.status(StatusCodes.OK).json({orders})
}

const getSinglelOrder = async(req, res) => {
   const {id:orderId} = req.params;

   const order = await Order.findOne({_id: orderId})

   if(!order){
    throw new customError.NotFoundError(`no order with id: ${orderId}`)
   }

   checkPermissions(req.user, order.user)
   res.status(StatusCodes.OK).json({order})
}

const getCurrentUserOrders = async(req, res) => {
    const orders = await Order.find({user: req.user.userId})
    res.status(StatusCodes.OK).json({nmbOfHts: orders.length, orders})
}

const updateOrder = async(req, res) => {
    const {id:orderId} = req.params;
    const {paymentIntent} = req.body;
    const order = await Order.findOne({_id: orderId})
 
    if(!order){
     throw new customError.NotFoundError(`no order with id: ${orderId}`)
    }
 
    checkPermissions(req.user, order.user)

    order.paymentIntent = paymentIntent;
    order.status = 'paid'

    await order.save()
    res.status(StatusCodes.OK).json({order})
}

const deleteOrder = async(req, res) => {
    const {id:orderId} = req.params;

   const order = await Order.findOne({_id: orderId})

   if(!order){
    throw new customError.NotFoundError(`no order with id: ${orderId}`)
   }

   checkPermissions(req.user, order.user)
   await order.remove()
   res.status(StatusCodes.OK).json({mwssg: 'order deleted'})
}


module.exports ={
    getAllOrders,
    getSinglelOrder,
    getCurrentUserOrders,
    createOrder,
    deleteOrder,
    updateOrder
}