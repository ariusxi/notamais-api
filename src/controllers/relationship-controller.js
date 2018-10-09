'use strict';

const repository = require('../repositories/relationship-repository');
const userrepository = require('../repositories/user-repository');
const config = require('../config');

const emailService = require('../services/email-service');

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

exports.getByUser = async(req, res, next) => {
    try{
        var data = await repository.getByUser(req.params.id);
        res.status(200).send(data);
    }catch(e){
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            data: e
        });
    }
}

exports.getByCounter = async(req, res, next) => {
    try{
        var data = await repository.getByCounter(req.params.id);
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
        let counter = await userrepository.getById(req.body.counter);
        let user = await  userrepository.getById(req.body.user);

        await repository.save({
            user: req.body.user,
            counter: req.body.counter,
            date: Date.now(),
            approved: false
        });

        emailService.send(
            counter.email,
            'Você recebeu uma solicitação',
            'Olá '+counter.name+', você acaba de receber uma solicitação de contratação da Empresa '+user.name+', para aceitar essa solicitação acesse o painel'
        );

        res.status(201).send({
            message: 'Solitação enviada com sucesso'
        });
    }catch(e){
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            data: e
        });
    }
}

exports.accept = async(req, res, next) => {
    try{
        await repository.accept(req.params.id);
        res.status(200).send({
            message:  'Convite de contrato aceito com sucesso'
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
            message: 'Solicitação recusada com sucesso'
        });
    }catch(e){
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            data: e
        });
    }
}