const cloudinary = require('cloudinary').v2
const Product = require('../models/Product')
const {StatusCodes} = require('http-status-codes')
const customError = require('../errors')
const fs = require('fs')


const createProduct = async(req, res) => {
    const result = await cloudinary.uploader.upload(
        req.files.image.tempFilePath,
        {
            use_filename: true,
            folder: 'upload-image2'
        }
    )
    console.log(result);
    fs.unlinkSync( req.files.image.tempFilePath)
    // return res.status(StatusCodes.OK).json({image: {src: result.secure_url}})
   req.body.user = req.user.userId;
   const product = await Product.create({
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    image:  result.secure_url,
    category: req.body.category,
    company: req.body.company,
    user: req.user.userId
   })

   res.status(StatusCodes.CREATED).json({product})
}


const getAllProducts = async(req, res) => {
    const products = await Product.find({})
    res.status(StatusCodes.OK).json({nmbofhits: products.length, products})
}


const getSingleProduct = async(req, res) => {
    
    const {id: productId} = req.params;
    const product = await Product.findOne({_id:productId}).populate('reviews')

    if(!product){
        throw new customError.NotFoundError(`no product with this id: ${productId}`)
    }
    res.status(StatusCodes.OK).json({product})

}


const updateProduct = async(req, res) => {
    const {id: productId} = req.params;
    const product = await Product.findByIdAndUpdate({_id:productId}, req.body,
        { 
            new:true,
             runValidators:true
            })

            if(!product){
                throw new customError.NotFoundError(`no product with this id: ${productId}`)
            }

    res.status(StatusCodes.OK).json({product})

}


const deleteProduct = async(req, res) => {
    const {id: productId} = req.params;
    const product = await Product.findOne({_id:productId})
    if(!product){
        throw new customError.NotFoundError(`no product with this id: ${productId}`)
    }
    await product.remove()
    res.status(StatusCodes.OK).json({message: 'product delete succeffuly'})

}


// const uploadImage = async(req, res) => {
//     const result = await cloudinary.uploader.upload(
//         req.files.image.tempFilePath,
//         {
//             use_filename: true,
//             folder: 'upload-image2'
//         }
//     )
//     console.log(result);
//     fs.unlinkSync( req.files.image.tempFilePath)
//     return res.status(StatusCodes.OK).json({image: {src: result.secure_url}})
// }

module.exports = {
    createProduct,
    getSingleProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    updateProduct
}