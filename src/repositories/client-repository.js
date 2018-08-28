'use strict';

const mongoose = require('mongoose');
const Client = mongoose.model('Client');

exports.get = async(id) => {
    const res = await Client.find({
        user: id
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