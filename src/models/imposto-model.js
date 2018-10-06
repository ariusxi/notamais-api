'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    CST:{
        type: String
    },
    vBC: {
        type: String
    },
    valor: {
        type: String
    },
    percent: {
        type: String
    },
    ipi: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'IPI'
    },
    icms: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ICMS'
    }
});

module.exports = mongoose.model('Imposto', schema);