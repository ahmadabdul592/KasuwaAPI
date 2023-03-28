const { string, required } = require('joi')
const mongoose = require('mongoose')


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'please provide name'],
        maxlenght: [100, 'name should not be more than 100 characters']
    },
    price: {
        type: Number,
        required: [true, 'please provide price'],
        default: 0
    },

    description: {
        type: String,
        maxlenght: [1000, 'description should not be more than 1000 characters'],
        required: [true, 'please provide description'],
    },
    image:{
        type: String,
        default: ''
    },
    category:{
        type:String,
        required: [true, 'please provide category'],
        enum: ['office', 'kitchen', 'bedroom']
    },
    company:{
        type:String,
        required: [true, 'please provide company'],
        enum: {
            values: ['ikea', 'liddy', 'marcos'],
            message: '{VALUE} not supported'
        }
    },
    colors: {
        type: [String],
        required: true,
        default: ['222']
    },
    featured:{
        type:Boolean,
        default: false
    },
    freeShipping:{
        type:Boolean
    },
    inventory:{
        type:Number,
        default:15,
        required: true
    },
    averageRating:{
        type:Number,
        default: 0
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required:true
    },
   
},{timestamps: true, toJSON: {virtuals: true}, toObject: {virtuals: true}})

productSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product',
    justOne: false
})

productSchema.pre('remove', async function(){
    await this.model('Review').deleteMany({product:this._id})
})


module.exports = mongoose.model('Product', productSchema)