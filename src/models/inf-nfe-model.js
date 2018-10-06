'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    versao: {
        type: String
    },
    ide: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'IDE'
    },
    total: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Total'
    },
    dest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dest'
    },
    emite: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Emit'
    },
    transp: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transp'
    },
    ide: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'IDE'
    },
    dest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dest'
    },
    file: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('infNFe', schema);