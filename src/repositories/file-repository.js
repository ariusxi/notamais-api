'use strict';

const mongoose = require('mongoose');
const File = mongoose.model('File');

exports.get = async(id) => {
    const res = await File.find({
        user: id
    });
    return res;
}

exports.getById = async(id) => {
    const res = await File.findById(id);
    return res;
}

exports.getByUser = async(id) => {
    const res = await File.find({
        user: id
    });
    return res;
}

exports.getAll = async() => {
    const res = await File.find({});
    return res;
}

exports.post = async(data) => {
    var file = new File(data);
    await file.save();
}

exports.putNfe = async(id, nfe) => {
    const res = File.updateOne({ _id: id },{ nfe: nfe });
    return res;
}

exports.delete = async(id) => {
    await File.findByIdAndRemove(id, (err) => {
        console.log(err);
    });
}