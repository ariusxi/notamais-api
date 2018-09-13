'use strict';

const mongoose = require('mongoose');
const Payment = mongoose.model('Payment');

exports.get = async() => {
    const res = await Payment.find({});
    return res;
}

exports.getById = async(id) => {
    const res = await Payment.findById(id);
    return res;
}

exports.getByUser = async(user) => {
    const res = await Payment.find({
        user: user
    });
    return res;
}

exports.post = async(data) => {
    var payment = new Payment(data);
    await payment.save();
}