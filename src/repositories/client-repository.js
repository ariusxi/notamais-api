'use strict';

const mongoose = require('mongoose');
const Client = mongoose.model('Client');

exports.get = async(id) => {
    const res = await Client.find({
        user: id
    });
    return res;
}

exports.getByUser = async(user) => {
    const res = await Client.findOne({
        user: user
    });
    return res;
}

exports.create = async(data) =>  {
    var client = new Client(data);
    return await client.save();
}

exports.put = async(data, id) =>  {
    const res = await Client.updateOne({ user:  id } , {
        fantasia: data.fantasia,
        cnpj: data.cnpj,
        ie: data.ie,
        telephone: data.telephone
    });
    return res;
}

exports.putNfeId = async(nfe, id) => {
    const res = await Client.updateOne({ user: id }, {
        idNfe: nfe
    });
    return res;
}

exports.delete = async(id) => {
    const res = await Client.remove({
        user: id
    });
    return res;
}