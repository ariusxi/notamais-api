'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    cEnq: {
        type: String
    }
});

module.exports = mongoose.model('IPI', schema);