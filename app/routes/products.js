
const router = require('express').Router()
const { getAllProducts, getAllProductsStatic } = require('../controller/productController')



router.route('/').get(getAllProducts)
router.route('/static').get(getAllProductsStatic)


module.exports = router

