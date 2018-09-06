'use strict';

const mongoose = require('mongoose');
const Contract = mongoose.model('Contract');

exports.get = async() =>  {
    const res = await Contract.find({});
    return res;
}

exports.getById = async(id) => {
    const res = await Contract.findOne({
        _id: id
    })
    .populate('user')
    .populate('plan');
    return res;
}

exports.getByUser = async(user) => {
    const res = await Contract.findOne({
        user: user
    })
    .populate('user')
    .populate('plan');
    return res;
}

exports.post = async(data) => {
    var contract = new Contract(data);
    return await contract.save();
}

exports.renew = async(data, id) => {
    const res = await Contract.updateOne({ user: id }, {
        data: data.data,
        validade: data.validade
    });
    return res;
}

exports.delete = async(user) => {
    await Contract.findOneAndRemove(user);
}