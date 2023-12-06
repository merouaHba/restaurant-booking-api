

const mongoose = require('mongoose')



const ReviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review cannot be empty!']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user']
    }
})


module.exports = mongoose.model('Review', ReviewSchema)


