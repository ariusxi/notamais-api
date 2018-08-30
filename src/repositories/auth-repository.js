'use strict';

const mongoose = require('mongoose');
const Auth = mongoose.model('Auth');

exports.get = async() => {
    const res = await Auth.find({}).populate('user');
    return res;
}

exports.getByUser = async(user) => {
    const res = await Auth.find({
        user: user
    });
    return res;
}

exports.create = async(data) => {
    var auth = new Auth(data);
    return await auth.save();
}