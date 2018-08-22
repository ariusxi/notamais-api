'use strict';

const mongoose = require('mongoose');
const Person = mongoose.model('Person');

exports.get = async(id)  => {
    const res = await Person.findById(id);
    return res;
}

exports.create = async(data) => {
    var person = new Person(data);
    await person.save();
}

exports.update = async(data, id) =>  {
    const res = await Person.updateMany({ user: id}, {
        gender: data.gender,
        nickname: data.nickname,
        cpf: data.cpf
    });
    return res;
}