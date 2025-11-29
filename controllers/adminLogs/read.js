const Sequelize = require('sequelize')
const Op = Sequelize.Op
const { AdminLog } = require('../../models/sequelize')

const adminLogsSearchFilterGenerator = (query, currentAdmin) => {
  try {
    const adminLogsSearchFilters = []

    if (query.search) {
      adminLogsSearchFilters.push({
        activityInfo: { [Op.like]: `%${query.search}%` }
      })
    }

    if (currentAdmin.role === 'admin') {
      adminLogsSearchFilters.push({
        '$admin.storeId$': currentAdmin.storeId
      })
    }

    if (query.from && query.to) {
      adminLogsSearchFilters.push({
        createdAt: {
          [Op.between]: [new Date(query.from), new Date(query.to)]
        }
      })
    } else if (query.from) {
      adminLogsSearchFilters.push({
        createdAt: {
          [Op.gte]: new Date(query.from)
        }
      })
    } else if (query.to) {
      adminLogsSearchFilters.push({
        createdAt: {
          [Op.lte]: new Date(query.to)
        }
      })
    }

    return adminLogsSearchFilters.length === 0 ? {} : { [Op.and]: adminLogsSearchFilters }
  } catch (error) {
    throw new Error(error)
  }
}

const adminLogDataFormatter = (data) => {
  if (!data) {
    return []
  }

  const formatData = (data) => {
    const { ...newData } = data.toJSON()
    return {
      ...newData,
    }
  }

  return Array.isArray(data) ? data.map(formatData) : formatData(data)
}

const adminLogsCount = async (req, res) => {
  try {
    const currentAdmin = req.currentAdmin
    const find = adminLogsSearchFilterGenerator(req.query, currentAdmin)
    const count = await AdminLog.count({
      where: find
    })

    return res.status(200).json({ data: { count } })
  } catch (error) {
    return res.status(500).json({ errors: [{ status: '500', detail: error }] })
  }
}

const adminLogsFetchMany = async (req, res) => {
  try {
    const currentAdmin = req.currentAdmin
    const find = adminLogsSearchFilterGenerator(req.query, currentAdmin)
    const sort = req.query.sort === 'email' ? ['email', 'ASC'] : ['createdAt', 'DESC']

    const perPage = +req.query.perPage
    const currentPage = +req.query.currentPage

    const skip = currentPage && perPage ? (currentPage - 1) * perPage : 0
    const limit = currentPage && perPage ? perPage : 0

    const adminLogs = await AdminLog.findAll({
      where: find,
      attributes: { exclude: ['id'] },
      order: [sort],
      offset: skip,
      limit
    })

    const data = adminLogDataFormatter(adminLogs)

    return res.status(200).json({ data })
  } catch (error) {
    return res.status(500).json({ errors: [{ status: '500', detail: 'Internal Server Error' }] })
  }
}

module.exports = {
  adminLogsCount,
  adminLogsFetchMany
}
