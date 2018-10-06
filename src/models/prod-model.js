'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    cfop: {
        type: Number,
        required: true
    },
    ncm: {
        type: Number
    },
    cEAN: {
        type: String
    },
    cEANTrib: {
        type: String
    },
    cProd: {
        type: Number
    },
    indTot: {
        type: Number
    },
    qCom: {
        type: Number
    },
    qTrib: {
        type: Number
    },
    uCom: {
        type: String
    },
    uTrib: {
        type: String
    },
    vProd: {
        type: Number
    },
    vUnCom: {
        type: Number
    },
    vUnTrib: {
        type: Number
    },
    xProd: {
        type: String
    }
});

module.exports = mongoose.model('Prod', schema);