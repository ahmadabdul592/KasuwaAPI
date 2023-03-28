const express = require('express')
const router = express.Router()
const {
    createReview,
    getAllReviews,
    getSingleReview,
    updateReview,
    deleteReview
} = require('../controllers/reviewController')

const {auth, authorizePermissions} = require('../middleware/auth')


router
.route('/')
.post(auth,createReview)
.get(getAllReviews)


router
.route('/:id')
.get(getSingleReview)
.patch(auth, updateReview)
.delete(auth,deleteReview)


module.exports = router