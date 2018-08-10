'use strict';

const mongoose = require('mongoose');
const User = mongoose.model('User');
const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/user-repository');

exports.get = async(req, res, next) => {
    try{
        var data = await repository.get();
        res.status(200).send(data);
    }catch(e){
        res.status(500).send({
            'message' : 'Falha ao processar sua requisição'
        });
    }
}