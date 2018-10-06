'use strict';

const mongoose = require('mongoose');
const Emit = mongoose.model('Emit');

exports.get = async(id) => {
    const res = await Emit.findById(id);
    return res;
}

exports.getByData = async(data) => {
    const res = await Emit.findOne({
        xNome: data.xNome,
        cnpj: data.cnpj,
        ie: data.ie,
        crt: data.crt,
        ender: data.ender
    });
    return res;
}

exports.create = async(data) => {
    var emit = new Emit(data);
    return await emit.save();
}