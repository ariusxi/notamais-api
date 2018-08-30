'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    data: {
        type: Date,
        required: true
    },
    shelf_life: {
        type: Date,
        required: true
    },
    ativo: {
        type: Boolean,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan',
        required: true
    }
});

module.exports = mongoose.model('Contract', schema);