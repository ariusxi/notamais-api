'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    xml: {
        type: String,
        required: true
    },
    danfe: {
        type: String,
        required: false
    },
    nfe: {
        type: String,
        required: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    infnfe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'infNFe'
    }
});

module.exports = mongoose.model('File', schema);