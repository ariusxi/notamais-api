'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    cep: {
        type: String
    },
    uf: {
        type: String
    },
    cMun: {
        type: Number
    },
    cPais: {
        type: Number
    },
    nro: {
        type: String
    },
    xBairro: {
        type: String
    },
    xLgr: {
        type: String
    },
    xMun: {
        type: String
    },
    xPais: {
        type: String
    }
});

module.exports = mongoose.model('Ender', schema);