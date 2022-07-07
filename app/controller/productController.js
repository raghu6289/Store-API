const Product = require('../model/productSchema')

const getAllProductsStatic = async (req, res) => {
  // Testing

  // const prodcuts = await Product.find({ featured: true }) // 

  // const prodcuts = await Product.find({}).sort('-name -price') // sorting

  // const prodcuts = await Product.find({}).select('name price') // selected fields

  const prodcuts = await Product.find({}).sort('name').select('name price') // limit the no of rows

  res.status(200).json({ prodcuts, nbHits: prodcuts.length })
}


const getAllProducts = async (req, res) => {

  const { featured, company, name, sort, fields, numericFilters } = req.query

  const queryObject = {}
  if (featured) {
    queryObject.featured = featured === 'true' ? true : false
  }

  if (company) {
    queryObject.company = company
  }

  if (name) {
    queryObject.name = { $regex: name, $options: "i" }
  }

  if (numericFilters) {

    //price>40,rating>=4 - convert operators into mongo operators ex > = $gt 

    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte',
    }

    const regEx = /\b(<|>|>=|=|<|<=)\b/g

    // replacing with regex with operatorsMao

    let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`
    )

    //price-$gt-40,rating-$gte-4  - converting - seperated values into proper json format ex price-$gt-40 = {price:{$gt:40}}
    const options = ['price', 'rating']
    filters = filters.split(',').forEach(item => {
      const [field, operator, value] = item.split('-')
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) }
      }
    });
  }

  // below will execute all the above opertaions
  let result = Product.find(queryObject)

  if (sort) {
    // spilting the sort pair values by , and join by ' ' space
    let sortList = sort.split(',').join(' ')
    // sort is going to apply on the result data
    result = result.sort(sortList)
  } else {
    // if sort was not given the below sort will apply automatically
    result = result.sort('createdAt')
  }

  if (fields) {
    const fieldsList = fields.split(',').join(' ')
    result = result.select(fieldsList)
  }

  const page = Number(req.query.page) || 1 // no of pages or default page 1
  const limit = Number(req.query.limit) || 10 // no of limit or default limit 10
  const skip = (page - 1) * limit
  // (2-1) * 2
  // 1*2 = 2

  // total products 23
  // 4 = 7 7 7 2
  // for 23 items total page is 4 for the 1st page first 7 itmes nad 2nd page 7 items 

  result = result.skip(skip).limit(limit)

  // finally we awaiting for the total result
  const products = await result

  res.status(200).json({ products, nbHits: products.length })
}


module.exports = { getAllProducts, getAllProductsStatic }