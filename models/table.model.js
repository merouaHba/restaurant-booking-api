

const mongoose = require('mongoose')



const TableSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name cannot be empty!'],
        unique: true,
    },
    capacity: {
        type: Number,
    },
    // isAvailable: {
    //     type: Boolean,
    // },
 
})

module.exports = mongoose.model('Table', TableSchema)


