require('dotenv').config()
require('express-async-errors');

const express = require('express')

const productRoutes = require('./routes/products')
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')
const connectDB = require('./db/connect')

const app = express();

// middlewares
app.use(express.json())


// routes
app.get('/', (req, res) => {
  res.send('Store')
})

// products route
app.use('/api/v1/products', productRoutes)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000

const start = async () => {
  try {
    connectDB(process.env.MONGO_URI)
    app.listen(port, console.log('Server listening ...'))
  } catch (error) {
    console.error(error)
  }
}

start()