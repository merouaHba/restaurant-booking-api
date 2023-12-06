const Reservation = require('../models/reservation.model');
const Table = require('../models/table.model');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const validateMongoDbId = require('../utils/validateMongodbId');


const createReservation = async (req, res) => {
    let { name, phone, date, timeSlot, numberOfPeople } = req.body;
    //check tables availability
    date = new Date(date)
    const reservedTables = await Reservation.distinct('table', { date: date, timeSlot: timeSlot });
    const reservedTableIds = reservedTables.map(reservedTable => reservedTable.toString());
    if (reservedTableIds.length != 0) {
        const findTables = await Table.find({ _id: { $nin: reservedTableIds  }, capacity: { $gte: numberOfPeople } })
        if (findTables.length != 0) {
            const table = findTables.reduce((min, current) => (current.capacity < min.capacity ? current : min))

            const reservation = await Reservation.create({ ...req.body, table: table._id })
            res.status(StatusCodes.CREATED).json({
                status: "success",
                data: {
                    msg: 'Success! Reservation Created',
                }
            });

        } else {
            throw new CustomError.NotFoundError('No Table Available fo now')

        }
    } else {
        const findTables = await Table.find({ capacity: { $gte: numberOfPeople } })
        
        if (findTables.length != 0) {
            const table = findTables.reduce((min, current) => (current.capacity < min.capacity ? current : min))

            const reservation = await Reservation.create({ ...req.body,table:table._id })
            res.status(StatusCodes.CREATED).json({
                status: "success",
                data: {
                    msg: 'Success! Reservation Created',
                }
            });

        } else {
            throw new CustomError.NotFoundError('No Table Available fo now')

        }
    }

}


const getAllReservations = async (req, res) => {

    const reservations = await Reservation.find();
    res.status(StatusCodes.OK).json({
        status: "success",
        data: { reservations }
});
};

const getSingleReservation = async (req, res) => {
    validateMongoDbId(req.params.ReservationId)
    const reservation = await Reservation.findOne({ _id: req.params.ReservationId });
    if (!reservation) {
        throw new CustomError.NotFoundError(`No Reservation with id : ${req.params.ReservationId}`);
    }
    res.status(StatusCodes.OK).json({
        status: "success",
        data: { reservation }
});
};

const updateReservation = async (req, res) => {
    const id = req.params.ReservationId;
    if (Object.values(req.body).length === 0) {
        throw new CustomError.BadRequestError("no updated data")
    }

    const reservation = await Reservation.findOneAndUpdate({ _id: id }, req.body, {
        new: true,
        runValidators: true,
    })

    if (!reservation) {
        throw new CustomError.NotFoundError(`No Reservation with this id: ${id}`)
    }

    res.status(StatusCodes.OK).json({
        status: "success",
        data: { reservation }
});
};

const deleteReservation = async (req, res) => {
    const { ReservationId: id } = req.params
    validateMongoDbId(id)
    const reservationFound = await Reservation.findOne({ _id: id })

    if (!reservationFound) {
        throw new CustomError.NotFoundError(`No Reservation with this id: ${id}`)
    }


    const reservation = await Reservation.findOneAndDelete({ _id: id })
    res.status(200).json({
        status: "success",
        data: { msg: "success! Reservation deleted", reservation } })
}







module.exports = {
    createReservation,
    getAllReservations,
    getSingleReservation,
    updateReservation,
    deleteReservation
};

