require('dotenv').config()
require('express-async-errors')
// express

const express = require('express')
const app = express()

// rest of the packages
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const cloudinary = require('cloudinary').v2
const rateLimiter = require('express-rate-limit')
const cors = require('cors')
const xss = require('xss-clean')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')

const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml')

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API,
    api_secret:process.env.CLOUD_SECRET
})


// db
const connectDB = require('./db/connect')
connectDB()

// middleware
const notFoundMiddlewareError = require('./middleware/notFoundMiddleware')
const errohMiddlewareError = require('./middleware/errorHandlerMiddleware')

// security packages

app.set('trust proxy', 1)
app.use(rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 50
}))

app.use(cors())
app.use(mongoSanitize())
app.use(xss())
app.use(helmet())

app.get('/', (req, res) => {
    res.send('<h1>API DOCS</h1><a href="/api-docs">Documentation</a>')
})

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))
// routes
const authRouter = require('./routers/authRouter')
const userRouter = require('./routers/userRouter')
const productRouter = require('./routers/productRouter')
const reviewRouter = require('./routers/reviewRouter')
const orderRouter = require('./routers/orderRouter')

const port = process.env.PORT || 5000;

app.use(express.static('./public'))

app.use(express.json())
app.use(fileUpload({useTempFiles: true}))
app.use(morgan('tiny'))
app.use(cookieParser(process.env.JWT_SECRET))

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/product', productRouter)
app.use('/api/v1/review', reviewRouter)
app.use('/api/v1/order', orderRouter)


app.use(notFoundMiddlewareError)
app.use(errohMiddlewareError)


app.listen(port, () => {
    console.log('KASUWA API server is running')
})

