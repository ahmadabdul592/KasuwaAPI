const Review = require('../models/Review')
const Product = require('../models/Product')
const {StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')
const {checkPermissions} = require('../utils')

const createReview = async(req, res) => {
   
    const {product:productId} = req.body;

    const isProductValid = await Product.findOne({_id:productId})

    if(!isProductValid){
        throw new CustomError.BadRequestError(`no product with id: ${productId}`)
    }

    const isReviewAlreadyExist = await Review.findOne({
        product: productId,
        user: req.user.userId
    })

    if(isReviewAlreadyExist){
        throw new CustomError.BadRequestError('you have already add a review')
    }

    req.body.user = req.user.userId;

    const review = await Review.create(req.body)

    res.status(StatusCodes.CREATED).json({review})
}

const getAllReviews = async(req, res) => {
    const reviews = await Review.find({}).populate({
        path: 'product',
       select: 'name company price'
    })
    res.status(StatusCodes.OK).json({nbHits: reviews.length, reviews})
}


const getSingleReview = async(req, res) => {
    const {id:reviewId} = req.params;
    const review = await Review.findOne({_id: reviewId})

    if(!review){
        throw new CustomError.NotFoundError(`there is no review with this id: ${reviewId}`)
    }

    res.status(StatusCodes.OK).json({review})
}

const updateReview = async(req, res) => {
   const updates = Object.keys(req.body)
   const allowedUpdates = ['title', 'rating', 'comment']

   const isValidOps = updates.every((update) => allowedUpdates.includes(update))
   
   if(!isValidOps){
    throw new CustomError.BadRequestError('invalid updates')
   }
   const review = await Review.findOne({_id:req.params.id})

   if(!review){
    throw new CustomError.NotFoundError(`no review with this id: ${req.params.id}`)
   }

   checkPermissions(req.user, review.user)

   updates.forEach((update) => review[update] = req.body[update])
   await review.save()
   res.status(StatusCodes.OK).json({messg: 'update successful'})
}

const deleteReview = async(req, res) => {
    const {id:reviewId} = req.params;

    const review = await Review.findOne({_id: reviewId})
    if(!review){
        throw new CustomError.NotFoundError(`no review with this id:${reviewId}`)
    }
    console.log(req.user, review.user);
    checkPermissions(req.user, review.user)
    await review.remove()

    res.status(StatusCodes.OK).json({messageg: 'review deleted'})
}


module.exports = {
    createReview,
    getAllReviews,
    getSingleReview,
    updateReview,
    deleteReview
}