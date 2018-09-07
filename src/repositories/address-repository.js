'use strict';

const mongoose = require('mongoose');
const Address = mongoose.model('Address');

exports.get = async(id) =>  {
    const res = await Address.find({
        user: id
    });
    return res;
}

exports.getById = async(id) => {
    const res  = await Address.findById(id);
    return res;
}

exports.create = async(data) => {
    var address = new Address(data);
    await address.save();
}

exports.update = async(id, data) => {
    await Address.findByIdAndUpdate(id, {
        $set: {
            number: data.number,
            cep: data.cep,
            complement: data.complement,
            public_place: data.public_place,
            neighborhood: data.neighborhood,
            city: data.city,
            uf: data.city
        }
    });
}

exports.delete = async(id) => {
    await Address.findByIdAndRemove(id);
}