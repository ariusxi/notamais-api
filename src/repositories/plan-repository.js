'use strict';

const mongoose = require('mongoose');
const Plan = mongoose.model('Plan');

exports.get = async() =>  {
    const res = await Plan.find({});
    return res;
}

exports.create = async(data) => {
    var plan = new Plan(data);
    await plan.save();
}

exports.update = async(id, data) => {
    await Plan.findByIdAndUpdate(id, {
        $set: {
            name: data.name,
            description: data.description,
            value: data.value,
            qtdeXML: data.qtdeXML
        }
    });
}

exports.delete = async(id) => {
    await Plan.findByIdAndRemove(id);
}