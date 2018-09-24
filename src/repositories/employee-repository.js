'use strict';

const mongoose  = require('mongoose');
const Employee = mongoose.model('Employee');

exports.get = async(id) => {
    const res = await Employee.find({
        user: id
    }, 'person user')
    .populate('person');
    return res;
}

exports.getByPerson = async(person) => {
    const res = await Employee.findOne({
        person: person
    });
    return res;
}

exports.post = async(data) => {
    var employee = new Employee(data);
    return await employee.save();
}

exports.delete = async(id) => {
    await Employee.findByIdAndRemove(id, (err) => {
        console.log(err);
    });
}