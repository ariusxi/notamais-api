'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    xNome: {
        type: String
    },
    cnpj: {
        type: String
    },
    ie: {
        type: String
    },
    crt: {
        type: Number
    },
    ender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ender',
        required: true
    }
});

module.exports = mongoose.model('Emit', schema);