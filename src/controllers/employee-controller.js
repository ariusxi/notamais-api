'use strict';

const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/employee-repository');
const personrepository = require('../repositories/person-repository');
const md5 = require('md5');

const emailService = require('../services/email-service');
const authService = require('../services/auth-service');

exports.get = async(req, res, next) => {
    try{
        var data  = await repository.get(req.params.id);
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
        //Inserindo funcionário no banco
        await personrepository.create({
            name: req.body.name,
            gender: req.body.gender,
            nickname: req.body.nickname,
            cpf: req.body.cpf
        });

        const person = await personrepository.getByCpf(req.body.cpf);

        await repository.create({
            person: person._id,
            user: req.params.id
        });

        res.status(200).send({
            message: 'Funcionário cadastrado com sucesso'
        });
    }catch(e){
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
}

exports.put = async(req, res, next) => {
    try{

        const person = await repository.getById(req.params.id);

        if(!user){
            res.status(401).send({
                message: 'Funcionário não encontrado'
            });
        }

        //Alterando dados de funcionário
        await personrepository.update({
            name: req.body.name,
            gender: req.body.gender,
            nickname: req.body.nickname,
            cpf: cpf.body.cpf
        }, req.params.id);

        res.status(201).send({
            message: 'Funcionário atualizado com sucesso'
        });
    }catch(e){
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
}

exports.delete = async(req, res, next) => {
    try{
        await repository.delete(req.params.id);
        res.status(200).send({
            message: 'Funcionário removido com sucesso'
        });
    }catch(e){
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            data: e
        });
    }
}