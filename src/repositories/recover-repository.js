'use strict';

const mongoose = require('mongoose');
const Recover = mongoose.model('Recover');

exports.get = async(token) => {
    const res = await Recover.findOne({
        token: token
    });
    return res;
}

exports.create = async(data) => {
    var recover = new Recover(data);
    await recover.save();
}