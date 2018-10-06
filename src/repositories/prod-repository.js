'use strict';

const mongoose = require('mongoose');
const Prod = mongoose.model('Prod');

exports.get = async(id) => {
    const res = await Prod.findById(id);
    return res;
}

exports.getByData = async(data) => {
    const res = await Prod.findOne({
        cfop: data.cfop,
        ncm: data.ncm,
        cProd: data.cProd,
        indTot: data.indTot,
        qCom: data.qCom,
        qTrib: data.qTrib,
        uCom: data.uCom,
        uTrib: data.uTrib,
        vProd: data.vProd,
        vUnCom: data.vUnCom,
        vUnTrib: data.vUnTrib,
        xProd: data.xProd
    });
    return res;
}

exports.create = async(data) => {
    var prod = new Prod(data);
    return await prod.save();
}