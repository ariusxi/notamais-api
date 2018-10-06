'use strict';

const mongoose = require('mongoose');
const infNFe = mongoose.model('infNFe');

exports.get = async(id) => {
    const res = await infNFe.findById(id);
    return res;
}

exports.getAll = async(id) => {
    const res = await infNFe.find({
        user: id
    })
    .populate("ide")
    .populate("total")
    .populate("dest")
    .populate("emite")
    .populate("transp")
    .populate("file")
    .populate("user");
    return res;
}

exports.getByData = async(data) => {
    const res = await infNFe.findOne({
        versao: data.versao,
        ide: data.ide,
        total: data.totall,
        dest: data.dest,
        emite: data.emite,
        transp: data.transp,
        ide: data.ide,
        dest: data.dest
    });
    return res;
}

exports.create = async(data) => {
    var infnfe = new infNFe(data);
    return await infnfe.save();
}