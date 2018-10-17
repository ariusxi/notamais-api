'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    notation: {
        type: Number,
        enum: [1,2,3,4,5],
        required: true
    },
    comment: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Evaluation', schema);