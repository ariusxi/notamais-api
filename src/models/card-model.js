'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    CardNumber: {
        type: String,
        required: true
    },
    Holder: {
        type: String,
        required: true
    },
    ExpirationDate: {
        type: String,
        required:  true
    },
    SecurityCode: {
        type: String,
        required:  true
    },
    Brand: {
        type: String,
        required: true
    },
    selected: {
        type: Boolean,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ["DebitCard", "CreditCard"]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Card', schema);