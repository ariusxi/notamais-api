'use strict';

const mongoose = require('mongoose');
const Auth = mongoose.model('User');

exports.get = async() => {
    const res = await Auth.find({}).populate('user');
    return res;
}

exports.create = async(data) => {
    var auth = new Auth(data);
    return await auth.save();
}