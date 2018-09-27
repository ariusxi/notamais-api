'use strict';

const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.get = async() => {
    const res = await User.find({});
    return res;
}

exports.create = async(data) =>  {
    var user = new User(data);
    return await user.save();
}

exports.getById = async(id) => {
    const res = await User.findById(id);
    return res;
}

exports.getByEmail = async(email) => {
    const res = await User.findOne({
        email: email
    });
    return res;
}

exports.getCounters = async(search) => {
    const res = await User.find({
        $or: [{
            name: {
                '$regex' : search,
                '$options': 'i'
            },
            roles: ["counter"]
        },{
            email: {
                '$regex' : search,
                '$options': 'i'
            },
            roles: ["counter"]
        }]
    });
    return res;
}

exports.authenticate = async(data) => {
    const res = await User.findOne({
        $or :[{
            email: data.email,
            password: data.password
        }, {
            nickname: data.email,
            password: data.password
        }]
    });
    return res;
}

exports.resetPassword = async(password, id) => {
    const res = await User.updateOne({ _id: id },{ 
        password: password
    });
    return res;
}

exports.activate = async(id) =>  {
    const res = await User.updateOne({ _id : id },{ active: true });
    return res;
}

exports.block = async(id, block) => {
    const res = await User.updateOne({ _id: id }, { 
        active: block 
    });
    return res;
}

exports.confirmed = async(id) => {
    const res = await User.updateOne({ _id: id },{ active: true });
    return res;
}

exports.updateProfile = async(data, id) => {
    const res = await User.updateMany({ _id: id},{
        name: data.name,
        email: data.email
    });
    return res;
}