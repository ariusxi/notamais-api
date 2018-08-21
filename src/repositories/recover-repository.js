'use strict';

const mongoose = require('mongoose');
const Recover = mongoose.model('Recover');

exports.get = async(data) => {
    const res = await Recover.find({
        token: data.token,
        data: data.user
    });
}

exports.create = async(data) => {
    var recover = new Recover(data);
    await recover.save();
}