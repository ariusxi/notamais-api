'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    admin: {
        type: Boolean,
        required: false
    },
    person: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Employee', schema);