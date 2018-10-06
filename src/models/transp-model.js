'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    cnpj: {
        type: String
    },
    ie: {
        type: String
    },
    xNome: {
        type: String
    },
    modFrete: {
        type: String
    },
    xEnder: {
        type: String
    },
    xMun: {
        type: String
    },
    uf: {
        type:String
    },
    infAdFisico: {
        type: String
    }
});

module.exports = mongoose.model('Transp', schema);