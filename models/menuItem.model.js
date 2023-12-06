const mongoose = require('mongoose')


const MenuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A menu item must have a name'],
        trim: true
    },
    slug: String,
    image: {
        type: {
            public_id: {
                type: String,
                required: [true, 'A menu item must have a main image id']

            },
            url: {
                type: String,
                required: [true, 'A menu item must have a main image url']
            }
        },
        required: [true, 'A menu item must have a main image']


    },
    description: {
        type: String,
        required: [true, 'A menu item must have a description']
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
})


module.exports = mongoose.model('Menu Item', MenuItemSchema)