'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    orig: {
        type: String
    },
    modBC: {
        type: String
    },
    modBCST: {
        type: String
    },
    vBCST: {
        type: String
    },
    pICMSST: {
        type: Number
    },
    vICMSST: {
        type: Number
    }
});

module.exports = mongoose.model('ICMS', schema);