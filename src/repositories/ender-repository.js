'use strict';

const mongoose = require('mongoose');
const Ender = mongoose.model('Ender');

exports.get = async(id) => {
    const res = await Ender.findById(id);
    return res;
}

exports.getByData = async(data) => {
    const res = await Ender.findOne({
        cep: data.cep,
        uf: data.uf,
        cMun: data.cMun,
        cPais: data.cPais,
        nro: data.nro,
        xBairro: data.xBairro,
        xLgr: data.xLgr,
        xMun:  data.xMun,
        xPais: data.xPais
    });
    return res;
}

exports.create = async(data) => {
    var ender = new Ender(data);
    return await ender.save();
}