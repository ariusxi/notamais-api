'use strict';

const mongoose = require('mongoose');
const IDE = mongoose.model('IDE');

exports.get = async(id) => {
    const res = await IDE.findById(id);
    return res;
}

exports.getByData = async(data) => {
    const res = await IDE.findOne({
        cMunFG: data.cMunFG,
        cUF: data.cUF,
        dhEmi: data.dhEmi,
        finNFe: data.finNFe,
        idDest: data.idDest,
        indFinal: data.indFinal,
        indPag: data.indPag,
        indPres: data.indPres,
        mod: data.mod,
        natOp: data.natOp,
        procEmit: data.procEmi,
        serie: data.serie,
        tpAmb: data.tpAmb,
        tpNF: data.tpNF
    });
    return res;
}

exports.create = async(data) => {
    var ide = new IDE(data);
    return await ide.save();
}