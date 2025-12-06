const mongoose = require('mongoose');

const ImagesSchema = new mongoose.Schema({
    URL:{
        type: String,
        required: true,
    },

    title: {
        type: String,
        required: true,
    },

    description: {
        type: String,
    },

},{timestamps: true});

module.exports = mongoose.model('Images', ImagesSchema);