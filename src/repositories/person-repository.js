'use strict';

const mongoose = require('mongoose');
const Person = mongoose.model('Person');

exports.get = async(id)  => {
    const res = await Person.find({
        user: id
    });
    return res;
}

exports.getByCpf = async(cpf) => {
    const res = await Person.findOne({
        cpf: cpf
    });
    return res;
}

exports.getByUser = async(user) => {
    const res = await Person.findOne({
        user: user
    });
    return res;
}

exports.create = async(data) => {
    var person = new Person(data);
    await person.save();
}

exports.update = async(data, id) =>  {
    const res = await Person.updateOne({ user: id}, {
        gender: data.gender,
        nickname: data.nickname,
        cpf: data.cpf
    });
    return res;
}

exports.delete = async(id) => {
    const res = await Person.remove({
        user: id
    });
    return res;
}