'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    cMunFG: {
        type: String
    },
    cUF: {
        type: String
    },
    dhEmi: {
        type: String
    },
    finNFe:  {
        type: String
    },
    idDest: {
        type: String
    },
    indFinal: {
        type: String
    },
    indPag: {
        type: String
    },
    indPres: {
        type: String
    },
    mod: {
        type: String
    },
    natOp: {
        type: String
    },
    procEmi: {
        type: String
    },
    serie: {
        type: Number
    },
    tpAmb: {
        type: String
    },
    tpNF: {
        type: String
    }
});

module.exports = mongoose.model('IDE', schema);