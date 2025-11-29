const express = require('express')
const routerAdmin = express.Router()

const { authAdmin, authCurrentAdmin, signOutAdmin } = require('../controllers/authentication/admin.js')
const { adminAccountUpdate, adminAccountChangePW } = require('../controllers/account/admin.js')

const { passwordReset } = require('../controllers/account/passwordReset.js')

const { adminCreate } = require('../controllers/admin/create.js')
const { adminCount, adminFetch, adminFetchMany } = require('../controllers/admin/read.js')
const { adminUpdate } = require('../controllers/admin/update.js')
const { adminDelete } = require('../controllers/admin/delete.js')

const { adminLogsCount, adminLogsFetchMany } = require('../controllers/adminLogs/read.js')

const { branchCreate } = require('../controllers/branch/create.js')
const { branchCount, branchFetch, branchFetchMany } = require('../controllers/branch/read.js')
const { branchUpdate } = require('../controllers/branch/update.js')
const { branchDelete } = require('../controllers/branch/delete.js')

const { salaryCreate } = require('../controllers/salary/create.js')
const { salaryUpdate } = require('../controllers/salary/update.js')
const { salaryCount, salaryFetch, salaryFetchMany, salary13thMonth} = require('../controllers/salary/read.js')

// Middleware
const { adminAuthenticated, userAuthorized, adminAuthorized, superAdminAuthorized } = require('../middleware/auth/admin.js')

// Admin Dashboard Authentication
routerAdmin.get('/admin/auth/user', adminAuthenticated, authCurrentAdmin)
routerAdmin.post('/admin/auth/signin', authAdmin)
routerAdmin.post('/admin/auth/signout', signOutAdmin)

// Admin Account Management
routerAdmin.put('/admin/account/update', adminAuthenticated, adminAccountUpdate)
routerAdmin.put('/admin/account/pwchange', adminAuthenticated, adminAccountChangePW)
routerAdmin.put('/admin/account/pwreset', passwordReset)

// Admin User Management
routerAdmin.get('/admin/admins/count', adminAuthenticated, userAuthorized, adminAuthorized, adminCount)
routerAdmin.get('/admin/admins/:id', adminAuthenticated, userAuthorized, adminFetch)
routerAdmin.get('/admin/admins', adminAuthenticated, userAuthorized, adminAuthorized, adminFetchMany)
routerAdmin.put('/admin/admins/:id', adminAuthenticated, userAuthorized, superAdminAuthorized, adminUpdate)
routerAdmin.post('/admin/admins', adminAuthenticated, userAuthorized, superAdminAuthorized, adminCreate)
routerAdmin.delete('/admin/admins', adminAuthenticated, userAuthorized, superAdminAuthorized, adminDelete)

// Admin Logs
routerAdmin.get('/admin/logs/count', adminAuthenticated, userAuthorized, adminAuthorized, adminLogsCount)
routerAdmin.get('/admin/logs', adminAuthenticated, userAuthorized, adminAuthorized, adminLogsFetchMany)

// Store Management
routerAdmin.get('/admin/stores/count', adminAuthenticated, userAuthorized, branchCount)
routerAdmin.get('/admin/stores/:id', adminAuthenticated, userAuthorized, branchFetch)
routerAdmin.get('/admin/stores', adminAuthenticated, userAuthorized, branchFetchMany)
routerAdmin.put('/admin/stores/:id', adminAuthenticated, userAuthorized, superAdminAuthorized, branchUpdate)
routerAdmin.post('/admin/stores', adminAuthenticated, userAuthorized, superAdminAuthorized, branchCreate)
routerAdmin.delete('/admin/stores', adminAuthenticated, userAuthorized, superAdminAuthorized, branchDelete)

//Salary Management
routerAdmin.post('/admin/salary', adminAuthenticated, userAuthorized, adminAuthorized, salaryCreate)
routerAdmin.put('/admin/salary/:id', adminAuthenticated, userAuthorized, adminAuthorized, salaryUpdate)
routerAdmin.get('/admin/salary/count', adminAuthenticated, userAuthorized, adminAuthorized, salaryCount)
routerAdmin.get('/admin/salary', adminAuthenticated, userAuthorized, adminAuthorized, salaryFetchMany)
routerAdmin.get('/admin/salary/:id', adminAuthenticated, userAuthorized, adminAuthorized, salaryFetch)
routerAdmin.get('/admin/13th-month', adminAuthenticated, userAuthorized, adminAuthorized, salary13thMonth)

module.exports = routerAdmin
