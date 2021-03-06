'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    registro: {
        type: Date
    },
    cod: {
        type: String
    },
    xml: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    idInfNFe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'idInfNFe'
    }
});

module.exports = mongoose.model('NFe', schema);