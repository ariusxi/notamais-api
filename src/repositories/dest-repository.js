'use strict';

const mongoose = require('mongoose');
const Dest = mongoose.model('Dest');

exports.get = async(id) => {
    const res = await Dest.findById(id);
    return res;
}

exports.getByData = async(data) => {
    const res = await Dest.findOne({
        cpfcnpj: data.cpfcnpj,
        ie: data.ie,
        xNome: data.xNome,
        indEDest: data.indEDest,
        ender: data.ender
    });
    return res;
}

exports.create = async(data) => {
    var dest = new Dest(data);
    return await dest.save();
}