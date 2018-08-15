'use strict';

const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.get = async() => {
    const res = await User.find({
        active: true
    });
    return res;
}

exports.create = async(data) =>  {
    var user = new User(data);
    await user.save();
}

exports.authenticate = async(data) => {
    const res = await User.findOne({
        email: data.email,
        password: data.password
    });
    return res;
}

exports.getById = async(id) => {
    const res = await User.findById(id);
    return res;
}

exports.resetPassword = async(password, id) => {
    const res = await User.updateOne({ _id: id },{ password: password });
    return res;
}

exports.activate = async(id) =>  {
    const res = await User.updateOne({ _id : id },{ active: true });
    return res;
}

exports.confirmed = async(id) => {
    const res = await User.updateOne({ _id: id },{ active: true});
    return res;
}

exports.updateProfile = async(data, id) => {
    const res = await User.updateMany({ _id: id},{
        name: data.name,
        email: data.email
    });
    return res;
}