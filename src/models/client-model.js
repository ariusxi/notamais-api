'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    fantasia: {
        type: String,
        required: true
    },
    cnpj: {
        type: String,
        required: true,
    },
    ie: {
        type: String,
        required: true
    },
    telephone: {
        type: String,
        required: true
    },
    idNfe: {
        type: String,
        required: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Client', schema);