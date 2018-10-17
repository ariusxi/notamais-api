'use strict';

const repository = require('../repositories/evaluation-repository');

exports.get = async(req, res, next) => {
    try{
        var data = await repository.get();
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
        var data = await repository.getById(req.params.id);
        res.status(200).send(data);
    }catch(e){
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            data: e
        });
    }
}

exports.getByFrom = async(req, res, next) => {
    try{
        var data = await repository.getByFrom(req.params.id);
        res.status(200).send(data);
    }catch(e){
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            data: e
        });
    }
}

exports.getByTo = async(req, res, next) => {
    try{
        var data = await repository.getByTo(req.params.id);
        res.status(200).send(data);
    }catch(e){
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            data: e
        });
    }
}

exports.create = async(req, res, next) => {
    try{
        await repository.create({
            from: req.body.from,
            to: req.body.to,
            notation: req.body.notation,
            comment: req.body.comment
        });

        res.status(201).send({
            message: 'Avaliação enviada com sucesso'
        });
    }catch(e){
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            data: e
        });
    }
}

exports.update = async(req, res, next) => {
    try{
        await repository.update({
            notation: req.body.notation,
            comment: req.body.comment
        }, req.params.id);

        res.status(201).send({
            message: 'Avaliação alterada com sucesso'
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

        res.status(201).send({
            message: 'Avaliação removida com sucesso'
        });
    }catch(e){
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            data: e
        });
    }
}