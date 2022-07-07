// inserting jason data's into mongoDB

const connect = require('./app/database/connect') // database connection
const product = require('./app/model/productSchema') // schema
const jsonData = require('./products.json')// data
require('dotenv').config()

const start = async () => {
  try {
    await connect(process.env.CONN)
    await product.deleteMany()
    await product.create(jsonData)
    console.log("Success");
    process.exit(0)// using global variable exit(0) to exit/stop the proccess
  } catch (error) {
    console.log(error);
    process.exit(1) // to print the errors
  }
}

start()