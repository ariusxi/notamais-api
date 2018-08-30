'use strict';

const mongoose = require('mongoose');
const Plan = mongoose.model('Plan');

exports.get = async() =>  {
    const res = await Plan.find({
        active: true
    });
    return res;
}

exports.getAdmin = async() => {
    const res = await Plan.find({});
    return res;
}

exports.getByQtdeXML = async(qtdeXML) => {
    const res = await Contract.find({});
    return res;
}

exports.getById = async(id) => {
    const res = await Plan.findById(id);
    return res;
}

exports.create = async(data) => {
    var plan = new Plan(data);
    await plan.save();
}

exports.update = async(id, data) => {
    const res = await Plan.updateOne({ _id: id},{
        name: data.name,
        description: data.description,
        value: data.value,
        qtdeXML: data.qtdeXML
    });
    return res;
}

exports.active = async(id, data) => {
    const res = await Plan.updateOne({ _id: id}, {
        active: data.active
    });
}

exports.delete = async(id) => {
    await Plan.findByIdAndRemove(id);
}