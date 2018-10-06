'use strict';

const mongoose = require('mongoose');
const Imposto = mongoose.model('Imposto');

exports.get = async(id) => {
    const res = await Imposto.findById(id);
    return res;
}

exports.getByData = async(data) => {
    const res = await Imposto.findOne({
        CST: data.CST,
        vBC: data.vBC,
        valor: data.valor,
        ipi: data.ipi
    });
    return res;
}

exports.create = async(data) => {
    var imposto = new Imposto(data);
    return await imposto.save();
}