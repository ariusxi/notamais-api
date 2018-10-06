'use strict';

const mongoose = require('mongoose');
const Total = mongoose.model('Total');

exports.get = async(id) => {
    const res = await Total.findById(id);
    return res;
}

exports.getByData = async(data) => {
    const res = await Total.findOne({
        vBC: data.vBC,
        vICMS: data.vICMS,
        vICMSDeson: data.vICMSDeson,
        vBCST: data.vBCST,
        vST: data.vST,
        vProd: data.vProd,
        vFrete: data.vFrete,
        vSeg: data.vSeg,
        vII: data.vII,
        vIPI: data.vIPI,
        vPIS: data.vPIS,
        vCOFINS: data.vCOFINS,
        vOutro: data.vOutro,
        vNF: data.vNF
    });
    return res;
}

exports.create = async(data) => {
    var total = new Total(data);
    return await total.save();
}