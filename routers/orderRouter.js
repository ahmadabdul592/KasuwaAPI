const express = require('express')
const router = express.Router()
const {auth, authorizePermissions} = require('../middleware/auth')
const {
    getAllOrders,
    getSinglelOrder,
    getCurrentUserOrders,
    createOrder,
    deleteOrder,
    updateOrder
} = require('../controllers/orderContrller')


router
.route('/')
.get([auth, authorizePermissions('admin')], getAllOrders)
.post(auth, createOrder)


router
.route('/showAllMyOrders')
.get(auth, getCurrentUserOrders)

router
.route('/:id')
.get(auth, getSinglelOrder)
.patch(auth, updateOrder)
.delete(auth, deleteOrder)


// router
// .route('/showAllMyOrders')
// .get(auth, getCurrentUserOrders)


module.exports = router