'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    vBC:{
        type: Number
    },
    vICMS: {
        type: Number
    },
    vICMSDeson: {
        type: Number
    },
    vBCST: {
        type: Number
    },
    vST: {
        type: Number
    },
    vProd: {
        type: Number
    },
    vFrete: {
        type: Number
    },
    vSeg: {
        type: Number
    },
    vII: {
        type: Number
    },
    vIPI: {
        type: Number
    },
    vPIS: {
        type: Number
    },
    vCOFINS: {
        type: Number
    },
    vOutro: {
        type: Number
    },
    vNF: {
        type: Number
    }
});

module.exports = mongoose.model('Total', schema);