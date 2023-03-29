const express = require('express')
const router = express()
const {auth, authorizePermissions} = require('../middleware/auth')



const {
    createProduct,
    getSingleProduct,
    getAllProducts,
    updateProduct,
    deleteProduct
} = require('../controllers/productController')


router
.route('/')
.post([auth, authorizePermissions('admin')],createProduct)
.get(getAllProducts)


// router
// .route('/upload')
// .post([auth, authorizePermissions('admin')],uploadImage)

router
.route('/:id')
.get(getSingleProduct).patch([auth, authorizePermissions('admin')],updateProduct)
.delete([auth, authorizePermissions('admin')],deleteProduct)

module.exports = router