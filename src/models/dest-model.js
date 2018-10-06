'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    cpfcnpj:{
        type: String
    },
    ie: {
        type: String
    },
    xNome: {
        type: String
    },
    indEDest: {
        type: String
    },
    ender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ender',
        required: true
    }
});

module.exports = mongoose.model('Dest', schema);