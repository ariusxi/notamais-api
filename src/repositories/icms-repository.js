'use strict';

const mongoose = require('mongoose');
const ICMS = mongoose.model('ICMS');

exports.get = async(id) => {
    const res = await ICMS.findById(id);
    return res;
}

exports.getByData = async(data) => {
    const res = await ICMS.findOne({
        origin: data.origin,
        modBC: data.modBC,
        pICMSST: data.pICMSST,
        vICMSST: data.vICMSST
    });
    return res;
}

exports.create = async(data) => {
    var icms = new ICMS(data);
    return await icms.save();
}