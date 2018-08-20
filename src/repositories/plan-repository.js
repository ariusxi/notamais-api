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