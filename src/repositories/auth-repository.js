'use strict';

const mongoose = require('mongoose');
const Auth = mongoose.model('Auth');

exports.get = async() => {
    const res = await Auth.find({}).sort({'date': -1}).limit(100).populate('user');
    return res;
}

exports.getByUser = async(user) => {
    const res = await Auth.findOne({
        user: user
    });
    return res;
}

exports.create = async(data) => {
    var auth = new Auth(data);
    return await auth.save();
}