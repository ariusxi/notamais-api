'use strict';

const mongoose = require('mongoose');
const Card = mongoose.model('Card');

exports.get = async(id) => {
    const res  = await Card.find({
        user: id
    });
    return res;
}

exports.getById = async(id) => {
    const res = await Card.findOne({
        _id: id
    });
    return res;
}

exports.getByNumber = async(number) => {
    const res = await Card.find({
        CardNumber: number
    });
    return res;
}

exports.disableAll = async(id) => {
    const res = await Card.updateMany({ user: id },{
        selected: false
    });
    return res;
}

exports.selected = async(id) => {
    const res = await Card.updateOne({ _id: id}, {
        selected: true
    });
    return res;
}

exports.post = async(data) => {
    var card = new Card(data);
    return await card.save();
}

exports.delete = async(id) => {
    await Card.findByIdAndRemove(id, (err) => {
        console.log(err);
    });
}