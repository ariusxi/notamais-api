'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    main: {
        type: Boolean,
        required: true
    },
    number: {
        type: String,
        required: true
    },
    cep: {
        type: String,
        required: true
    },
    complement: {
        type: String,
        required: false
    },
    public_place: {
        type: String,
        required: true
    },
    neighborhood: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: false
    },
    uf: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Address', schema);