'use strict';

const mongoose = require('mongoose');
const Address = mongoose.model('Address');

exports.get = async(id) =>  {
    const res = await Address.findOne({
        user: id
    });
    return res;
}

exports.create = async(data) => {
    var address = new Address(data);
    await address.save();
}