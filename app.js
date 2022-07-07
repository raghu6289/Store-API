require('express-async-errors');
require('dotenv/config')
const express = require('express')
const app = express()
const mongoSetup = require('./app/database/connect')
const notFound = require('./app/middleware/not-found')
const errorHandler = require('./app/middleware/error-handler')
const productRouter = require('./app/routes/products')


// Middlewares

app.use(express.json())

// Routes
app.use('/api/v1/products', productRouter)

// Error Handler Middlewares
app.use(notFound)
app.use(errorHandler)

//port
const port = 3000

const start = async () => {
  try {
    await mongoSetup(process.env.CONN)
    app.listen(port, () => console.log(`server is running at port ${port}`))

  } catch (err) {
    console.log(err);
  }
}

start()