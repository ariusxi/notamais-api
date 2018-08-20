'use strict';

const mongoose = require('mongoose');
const Address = mongoose.model('Address');

exports.get = async() =>  {
    const res = await Address.find({});
    return res;
}

exports.create = async(data) => {
    var address = new Address(data);
    await address.save();
}