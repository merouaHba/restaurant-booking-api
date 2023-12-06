const express = require('express')
const { getAllReservations, getSingleReservation, updateReservation, deleteReservation, createReservation } = require('../controllers/reservationController')
const router = express.Router()
const { authenticateUser, authorizePermissions } = require('../middlewares/authentication')
const { singleFile } = require('../utils/multer')

router.get('/', getAllReservations)
router.post('/add', createReservation)
router.get('/:ReservationId',  getSingleReservation)
router.put('/update/:ReservationId', authenticateUser, authorizePermissions("admin"), updateReservation)
router.delete('/delete/:ReservationId', authenticateUser, authorizePermissions("admin"), deleteReservation)

module.exports = router