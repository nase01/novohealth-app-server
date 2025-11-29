const Sequelize = require('sequelize')
const Op = Sequelize.Op
const literal = Sequelize.literal
const { Admin, Store } = require('../../models/sequelize')

const adminModelAssociates = () => {
  return [{
    model: Store,
    attributes: ['name'],
    as: 'store'
  }]
}

const adminSearchFilterGenerator = (query) => {
  try {
    const adminSearchFilters = []

    if (query.search) {
      adminSearchFilters.push({
        username: { [Op.like]: `%${query.search}%` }
      })
    }

    if (query.role) {
      adminSearchFilters.push({ role: query.role })
    }

    if (query.active) {
      adminSearchFilters.push({ active: query.active === 'true' })
    }

    if (query.storeId) {
      adminSearchFilters.push({ storeId: query.storeId })
    }

    return adminSearchFilters.length === 0 ? {} : adminSearchFilters
  } catch (error) {
    throw new Error(error)
  }
}

const adminDataFormatter = (data) => {
  if (!data) {
    return []
  }

  const formatData = (data) => {
    const { store, ...newData } = data.toJSON()
    return {
      ...newData,
      storeName: store ? store.name : '',
      imageURL: newData.imageURL || '',
      ipWhitelist: data.ipWhitelist ? data.ipWhitelist.split(',') : []
    }
  }

  return Array.isArray(data) ? data.map(formatData) : formatData(data)
}

const adminCount = async (req, res) => {
  try {
    const find = adminSearchFilterGenerator(req.query)
    const count = await Admin.count({ where: find })

    return res.status(200).json({ data: { count } })
  } catch (error) {
    return res.status(500).json({ errors: [{ status: '500', detail: 'Internal Server Error' }] })
  }
}

const adminFetch = async (req, res) => {
  const associates = adminModelAssociates()

  try {
    const admin = await Admin.findOne({
      include: associates,
      where: { id: req.params.id },
      attributes: { 
        exclude: ['password', 'pwReset', 'pwResetToken', 'pwResetExpiry'],
        include: [
          [literal("DATE_FORMAT(Admin.createdAt, '%Y-%m-%d %H:%i:%s')"), 'createdAt'],
          [literal("DATE_FORMAT(Admin.updatedAt, '%Y-%m-%d %H:%i:%s')"), 'updatedAt']
        ]
      }
    })
    const data = adminDataFormatter(admin) || []

    return res.status(200).json({ data })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ errors: [{ status: '500', detail: 'Internal Server Error' }] })
  }
}

const adminFetchMany = async (req, res) => {
  try {
    const find = adminSearchFilterGenerator(req.query)
    const associates = adminModelAssociates()
    const sort = req.query.sort === 'name' ? ['name', 'ASC'] : ['createdAt', 'DESC']

    const perPage = +req.query.perPage
    const currentPage = +req.query.currentPage

    const skip = currentPage && perPage ? (currentPage - 1) * perPage : 0
    const limit = currentPage && perPage ? perPage : 0

    const admin = await Admin.findAll({
      include: associates,
      where: find,
      attributes: { 
        exclude: ['password', 'pwReset', 'pwResetToken', 'pwResetExpiry'],
        include: [
          [literal("DATE_FORMAT(Admin.createdAt, '%Y-%m-%d %H:%i:%s')"), 'createdAt'],
          [literal("DATE_FORMAT(Admin.updatedAt, '%Y-%m-%d %H:%i:%s')"), 'updatedAt']
        ]
      },
      order: [sort],
      offset: skip,
      limit
    })

    const data = adminDataFormatter(admin)

    return res.status(200).json({ data })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ errors: [{ status: '500', detail: 'Internal Server Error' }] })
  }
}

module.exports = {
  adminCount,
  adminFetch,
  adminFetchMany
}
