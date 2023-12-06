const express = require('express')
const { createMenuItem,
    getMenu,
    getMenuItem,
    updateMenuItem,
    deleteMenuItem,
    updateMenuItemMainImage } = require('../controllers/menuItemController')
const router = express.Router()
const { authenticateUser, authorizePermissions } = require('../middlewares/authentication')
const { singleFile } = require('../utils/multer')




router.get("/", getMenu)
router.post("/", authenticateUser, authorizePermissions("admin"), singleFile('image'), createMenuItem)
router.get("/:id", getMenuItem)
router.put("/:id", authenticateUser, authorizePermissions("admin"), updateMenuItem)
router.delete("/:id", authenticateUser, authorizePermissions("admin"), deleteMenuItem)
router.put("/update-product-main-image/:id", authenticateUser, authorizePermissions("admin"), singleFile('mainImage'), updateMenuItemMainImage)

module.exports = router