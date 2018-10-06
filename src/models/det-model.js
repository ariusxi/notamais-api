'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema  = new Schema({
    nItem: {
        type: String
    },
    prod: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prod'
    },
    imposto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Imposto'
    }
});

module.exports = mongoose.model('Det', schema);