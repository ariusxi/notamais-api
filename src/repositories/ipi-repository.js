'use strict';

const mongoose = require('mongoose');
const IPI = mongoose.model('IPI');

exports.get = async(id) => {
    const res = await IPI.findById(id);
    return res;
}

exports.getByData = async(data) => {
    const res = await IPI.findOne({
        cEnq: data.cEnq
    });
    return res;
}

exports.create = async(data) => {
    var ipi = new IPI(data);
    return await ipi.save();
}