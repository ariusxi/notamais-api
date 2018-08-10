'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        required: true,
    },
    confirmed: {
        type: Boolean,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
    },
    type: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model('User', schema);