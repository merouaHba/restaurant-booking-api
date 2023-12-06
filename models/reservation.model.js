

const mongoose = require('mongoose')
const validator = require('validator');



const ReservationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name cannot be empty!']
    },
    phone: {
        type: String,
        required: [true, 'Please provide mobile number'],
        validate: {
            validator: validator.isMobilePhone,
            message: 'Please provide valid mobile number',
        },
    },
    table: {
        type: mongoose.Types.ObjectId,
        ref: 'Table',
        required: false
    },
    date: {
        type: Date,
        required: [true, 'date cannot be empty!']
    },
    timeSlot: {
        type: String,
        required: [true, 'timeSlot cannot be empty!']
    },
    numberOfPeople: {
        type: Number,
        required: [true, 'numberOfPeople cannot be empty!']
    }
})

module.exports = mongoose.model('Reservation', ReservationSchema)


