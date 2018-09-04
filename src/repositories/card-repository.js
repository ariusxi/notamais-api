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
    const res = await Card.find({
        _id: id
    });
    return res;
}

exports.post = async(data) => {
    var card = new Card(data);
    return await card.save();
}

exports.delete = async(id) => {
    await Card.findByIdAndRemove(id);
}