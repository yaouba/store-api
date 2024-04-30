const Product = require("../models/product")

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query
  const queryObj = {}

  if (featured) queryObj.featured = featured === 'true' ? true : false
  if (company) queryObj.company = company
  if (name) queryObj.name = { $regex: name, $options: 'i' }

   if (numericFilters) {
    const opartorMap = {
      '>' : '$gt',
      '>=' : '$gte',
      '<' : '$lt',
      '<=' : '$lte',
      '=' : '$eq',
    }
    const regEx = /\b(<|<=|>|>=|=)\b/g
    let filters = numericFilters.replace(regEx, (match) => `-${opartorMap[match]}-`)
    const options = ['price', 'rating']
    filters = filters.split(',').forEach((item) => {
      const [field, operator, value] = item.split('-')
      if (options.includes('field')) {
        queryObj[field] = { [operator]: Number(value) }
      }
    })
  }

  let result = Product.find(queryObj)

  if (fields) {
    const fieldsList = fields.split(',').join(' ')
    result = result.select(fieldsList)
  }

  if (sort) {
    const sortList = sort.split(',').join(' ')
    result = result.sort(sortList)
  } else {
    result = result.sort('-createdAt')
  }

 
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page -1) * limit
  result = result.skip(skip).limit(limit)

  const products = await result
  res.json({ nHits: products.length, products })
}

module.exports = {
  getAllProducts
}