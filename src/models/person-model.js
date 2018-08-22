'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    gender: {
        type: String,
        required: true
    },
    name: {
        type: String,
        require: false
    },
    nickname: {
        type: String,
        required: false
    },
    cpf: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }
});

module.exports = mongoose.model('Person', schema);