const Sequelize = require('sequelize')
const Op = Sequelize.Op
const { Branch } = require('../../models/sequelize')

const branchSearchFilterGenerator = (query) => {
  try {
    const branchSearchFilters = []

    if (query.search) {
      branchSearchFilters.push({
        name: { [Op.like]: `%${query.search}%` }
      })
    }

    return branchSearchFilters.length === 0 ? {} : branchSearchFilters
  } catch (error) {
    throw new Error(error)
  }
}

const branchCount = async (req, res) => {
  try {
    const find = branchSearchFilterGenerator(req.query)
    const count = await Branch.count({ where: find })

    return res.status(200).json({ data: { count } })
  } catch (error) {
    return res.status(500).json({ errors: [{ status: '500', detail: 'Internal Server Error' }] })
  }
}

const branchFetch = async (req, res) => {
  try {
    const branch = await Branch.findOne({
      where: { id: req.params.id },
      attributes: { exclude: ['version'] }
    })
    const data = branch || []

    return res.status(200).json({ data })
  } catch (error) {
    return res.status(500).json({ errors: [{ status: '500', detail: 'Internal Server Error' }] })
  }
}

const branchFetchMany = async (req, res) => {
  try {
    const find =  branchSearchFilterGenerator(req.query)
    const sort = req.query.sort === 'name' ? ['name', 'ASC'] : ['createdAt', 'DESC']

    const perPage = +req.query.perPage
    const currentPage = +req.query.currentPage

    const skip = currentPage && perPage ? (currentPage - 1) * perPage : 0
    const limit = currentPage && perPage ? perPage : 0

    const branch = await Branch.findAll({
      where: find,
      attributes: { exclude: ['version'] },
      order: [sort],
      offset: skip,
      limit
    })

    const data = branch

    return res.status(200).json({ data })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ errors: [{ status: '500', detail: 'Internal Server Error' }] })
  }
}

module.exports = {
  branchCount,
  branchFetch,
  branchFetchMany
}
