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
            'message' : 'Falha ao processar sua requisição',
            data: e
        });
    }
}

exports.post = async(req, res, next) => {
    let contract = new ValidationContract();

    //Validando dados
    constract.isEmail(req.body.email, 'Você deve informar um e-mail válido');
    contract.hasMinLen(req.body.password, 6, 'A sua senha deve ser mais que 6 dígitos');

    if(!contract.isValid()){
        res.status(400).send(contract.errors()).end();
    }
    
    try{
        //Inserindo usuário no banco
        await repository.create(req.body)
        res.status(201).send({
            message: 'Cadastro efetuado com sucesso'
        });
    }catch(e){
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            data: e
        });
    }
}