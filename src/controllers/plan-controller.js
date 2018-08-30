'use strict';

const repository = require('../repositories/plan-repository');

exports.get = async(req, res, next) => {
    try{
        var data = await repository.get();
        res.status(200).send(data);
    }catch(e){
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            data: e
        })
    }
}

exports.getAdmin = async(req, res, next) => {
    try{
        var data = await repository.getAdmin();
        res.status(200).send(data);
    }catch(e){
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            data: e
        });
    }
}

exports.getById = async(req, res, next) =>  {
    try{
        var data = await repository.getById(req.params.id);
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

        const plan = await repository.getPlan(req.body.qtdeXML, req.body.name);

        if(plan){
            res.status(400).send({
                message: 'Já existe um plano cadastro com esses dados'
            });
        }

        await repository.create({
            name: req.body.name,
            description: req.body.description,
            value: req.body.value,
            qtdeXML: req.body.qtdeXML,
            active: true
        });

        res.status(201).send({
            message: 'Plano cadastrado com sucesso'
        });
    }catch(e){
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            data: e
        });
    }
}

exports.put = async(req, res, next) => {
    try{
        const plan = await repository.getPlan(req.body.qtdeXML, req.body.name);

        if(plan && plan._id != req.params.id){
            res.status(400).send({
                message: 'Já existe um plano cadastro com esses dados'
            });
        }

        await repository.update(req.params.id, req.body);

        res.status(200).send({
            message: 'Plano alterado com sucesso'
        });
    }catch(e){
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            data: e
        });
    }
}

exports.delete = async(req, res, next) => {
    try{
        await repository.delete(req.params.id);
        res.status(200).send({
            message: 'Plano removido com sucesso'
        });
    }catch(e){
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            data: e
        });
    }
}

exports.activate = async(req, res, next) => {
    try{
        await repository.active(req.params.id, {
            active: req.body.active
        });

        res.status(200).send({
            message: 'Status de plano alterado com sucesso'
        });
    }catch(e){
        res.status(200).send({
            message: 'Falha ao processar sua requisição',
            data: e
        });
    }
}