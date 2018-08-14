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
    roles: [{
        type: String,
        required: true,
        enum: ['user', 'admin', 'employee', 'counter'],
        default: 'user'
    }],
});

module.exports = mongoose.model('User', schema);