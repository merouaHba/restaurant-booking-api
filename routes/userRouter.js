const express = require('express')
const { getAllUsers,getSingleUser,updateUser, deleteUser, createUser, uploadProfileImage, deleteProfileImage } = require('../controllers/userController')
const router = express.Router()
const { authenticateUser, authorizePermissions } = require('../middlewares/authentication')
const { singleFile } = require('../utils/multer')

router.get('/', authenticateUser, authorizePermissions('admin'), getAllUsers)
router.post('/add', authenticateUser, authorizePermissions('admin'), createUser)
router.post('/upload-profile-image/:userId', authenticateUser, singleFile('image'),uploadProfileImage)
router.delete('/upload-profile-image/:userId', authenticateUser,deleteProfileImage)
router.get('/:userId', authenticateUser, getSingleUser)
router.put('/update/:userId', authenticateUser, updateUser)
router.delete('/delete/:userId', authenticateUser, deleteUser)

module.exports = router