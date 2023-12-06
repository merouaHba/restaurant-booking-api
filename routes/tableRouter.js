const express = require('express')
const { getAllTables, getSingleTable, updateTable, deleteTable, createTable } = require('../controllers/tableController')
const router = express.Router()
const { authenticateUser, authorizePermissions } = require('../middlewares/authentication')

router.get('/', getAllTables)
router.post('/add', authenticateUser, authorizePermissions("admin"), authenticateUser, authorizePermissions('admin'), createTable)
router.get('/:TableId', getSingleTable)
router.put('/update/:TableId', authenticateUser, authorizePermissions("admin"),  updateTable)
router.delete('/delete/:TableId', authenticateUser, authorizePermissions("admin"), deleteTable)

module.exports = router