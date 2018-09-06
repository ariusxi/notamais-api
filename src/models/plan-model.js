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
        required: false
    },
    value: {
        type: Number,
        required: true,
    },
    promotion: {
        type: Number,
        required: false
    },
    qtdeXML: {
        type: Number,
        required: true
    },
    active: {
        type: Boolean,
        require: true
    }
});

module.exports = mongoose.model('Plan', schema);