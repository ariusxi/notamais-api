'use strict';

const mongoose = require('mongoose');
const Transp = mongoose.model('Transp');

exports.get = async(id) => {
    const res = await Transp.findById(id);
    return res;
}

exports.getByData = async(data) => {
    const res = await Transp.findOne({
        cnpj: data.cnpj,
        ie: data.ie,
        xNome: data.xNome,
        modFrete: data.modFrete,
        xMun: data.xMun,
        uf: data.uf
    });
    return res;
}

exports.create = async(data) => {
    var transp = new Transp(data);
    return await transp.save();
}
