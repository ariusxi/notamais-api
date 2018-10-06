'use strict';

const mongoose = require('mongoose');
const NFe = mongoose.model('NFe');

exports.get = async(id) => {
    const res = await NFe.findById(id);
    return res;
}

exports.create = async(data) => {
    var nfe = new NFe(data);
    return await nfe.save();
}