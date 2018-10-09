'use strict';

const mongoose = require('mongoose');
const Relationship = mongoose.model('Relationship');

exports.get = async() => {
    const res = await Relationship.find({});
    return res;
}

exports.getById = async(id) => {
    const res = await Relationship.findById(id)
    .populate("user")
    .populate("counter");
    return res;
}

exports.getByUser = async(user) =>  {
    const res = await Relationship.find({
        user: user
    })
    .populate("user")
    .populate("counter");
    return res;
}

exports.getByCounter = async(counter) => {
    const res = await Relationship.find({
        counter: counter
    })
    .populate("user")
    .populate("counter");
    return res;
}

exports.getByUserNon = async(user) => {
    const res = await Relationship.find({
        user: user,
        approved: false
    })
    .populate("user")
    .populate("counter");
    return res;
}

exports.getByCounterNon = async(counter) => {
    const res = await Relationship.find({
        counter: counter,
        approved: false
    })
    .populate("user")
    .populate("counter");
    return res;
}

exports.getByBoth = async(user, counter) => {
    const res = await Relationship.findOne({
        counter: counter,
        user: user
    })
    .populate("user")
    .populate("counter");
    return res;
}

exports.save = async(data) =>  {
    var relationship = new Relationship(data);
    return await relationship.save();
}

exports.accept = async(id) => {
    const res = await Relationship.updateOne({ _id: id },{
        approved: true
    });
    return res;
}

exports.delete = async(id) =>  {
    await Relationship.findByIdAndRemove(id);
}