'use strict';

const repository = require('../repositories/address-repository');

exports.get = async(req, res, next) => {
    try{
        var data = await repository.get();
        res.status(500).send(data);
    }catch(e){
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            data: e
        });
    }
}

exports.post = async(req, res, next) => {
    try{
        await repository.create(req.body);

        res.status(201).send({
            message: 'Endereço cadastrado com sucesso'
        });
    }catch(e){
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
}