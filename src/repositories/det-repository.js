'use strict';

const mongoose = require('mongoose');
const Det = mongoose.model('Det');

exports.get = async(id) => {
    const res = await Det.findById(id);
    return res;
}

exports.getByData = async(data) => {
    const res = await Det.find({
        nItem: data.nItem,
        prod: data.prod,
        imposto: data.imposto
    });
    return res;
}

exports.create = async(data) => {
    var det = new Det(data);
    return await det.save();
}