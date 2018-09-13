'use strict';

const repository = require('../repositories/payment-repository');

exports.get = async(req, res, next) => {
    try{
        let data = await repository.get();
        res.status(200).send(data);
    }catch(e){
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            data: e
        });
    }
}

exports.getById = async(req, res, next) => {
    try{
        let data = await repository.getById(req.params.id);
        res.status(200).send(data);
    }catch(e){
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            data: e
        });
    }
}

exports.getByUser = async(req, res, next) => {
    try{
        let data = await repository.getByUser(req.params.id);
        res.status(200).send(data);
    }catch(e){
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            data: e
        });
    }    
}

exports.post = async(req, res, next) => {
    try{
        await repository.post(req.body);

        res.status(201).send({
            message: 'Pagamento registrado com sucesso'
        });
    }catch(e){
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            data: e
        });
    }
}