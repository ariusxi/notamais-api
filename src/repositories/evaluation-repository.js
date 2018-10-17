'use strict';

const mongoose = require('mongoose');
const Evaluation = mongoose.model('Evaluation');

exports.get = async() => {
    const res = await File.find({})
    .populate('from')
    .populate('to');
    return res;
}

exports.getById = async(id) =>  {
    const res = await File.findById(id)
    .populate('from')
    .populate('to');
    return rers;
}

exports.getByFrom = async(from) => {
    const res = await File.find({
        from: from
    })
    .populate('from')
    .populate('to');
    return res;
}

exports.getByTo = async(to) => {
    const res = await File.find({
        to: to
    })
    .populate('from')
    .populate('to');
    return res;
}

exports.create = async(data) => {
    var evaluation = new Evaluation(data);
    return await evaluation.save();
}

exports.update = async(data, id) => {
    const res = await Evaluation.updateOne({ _id: id },{
        notation: data.notation,
        comment: data.comment
    });
}

exports.delete = async(id) => {
    await Evaluation.findByIdAndRemove(id, (err) => {
        console.log(err);
    });
}