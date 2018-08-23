'use strict';

const mongoose = require('mongoose');
const Recover = mongoose.model('Recover');

exports.get = async(token) => {
    const res = await Recover.findOne({
        token: token,
        used: false
    });
    return res;
}

exports.create = async(data) => {
    var recover = new Recover(data);
    await recover.save();
}


exports.used = async(token) => {
    const res = await Auth.updateMany({ token: token }, {
        used: true
    });
    return res;
}