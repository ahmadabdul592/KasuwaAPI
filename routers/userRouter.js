const express = require('express')
const router = express.Router()
const {
    getAllUsers,
    getSingleUser,
    getUserProfile,
    updateUser,
    updatePassword
} = require('../controllers/userController')
 const {auth, authorizePermissions} = require('../middleware/auth')
router
.route('/')
.get(auth, authorizePermissions('admin'),getAllUsers)

router
.route('/profile')
.get(auth, getUserProfile)

router
.route('/updateProfile')
.patch(auth, updateUser)

router
.route('/updatePassword')
.patch(auth, updatePassword)





// router
// .route('/deleteUser')
// .delete(auth, authorizePermissions('admin'),deleteUser)


router
.route('/:id')
.get(auth, getSingleUser)





module.exports = router