'use strict';

const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/user-repository');
const md5 = require('md5');

const emailService = require('../services/email-service');
const authService = require('../services/auth-service');

exports.get = async(req, res, next) => {
    try{
        var data = await repository.get();
        res.status(200).send(data);
    }catch(e){
        res.status(500).send({
            message : 'Falha ao processar sua requisição',
            data: e
        });
    }
}

exports.post = async(req, res, next) => {
    let contract = new ValidationContract();

    //Validando dados
    contract.isEmail(req.body.email, 'Você deve informar um e-mail válido');
    contract.hasMinLen(req.body.password, 6, 'A sua senha deve ser mais que 6 dígitos');

    if(!contract.isValid()){
        res.status(400).send(contract.errors()).end();
    }
    
    try{
        //Inserindo usuário no banco
        await repository.create({
            name: req.body.name,
            email: req.body.email,
            password:  md5(req.body.password + global.SALT_KEY),
            active: false,
            confirmed: false,
            createdAt: Date.now(),
            roles: ["user"]
        });

        emailService.send(
            req.body.email,
            'Bem vindo ao Nota Mais',
            global.EMAIL_TMPL.replace('{0}', req.body.name)
        );

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

exports.postAdmin = async(req, res, next) => {
    let contract = new ValidationContract();

    //Validando dados
    contract.isEmail(req.body.email, 'Você deve informar um e-mail válido');
    contract.hasMinLen(req.body.password, 6, 'A sua senha deve ser mais que 6 dígitos');

    if(!contract.isValid()){
        res.status(400).send(contract.errors()).end();
    }
    
    try{
        //Inserindo usuário no banco
        await repository.create({
            name: req.body.name,
            email: req.body.email,
            password:  md5(req.body.password + global.SALT_KEY),
            active: true,
            confirmed: true,
            createdAt: Date.now(),
            roles: ["admin"]
        });

        emailService.send(
            req.body.email,
            'Bem vindo ao Nota Mais',
            global.EMAIL_TMPL.replace('{0}', req.body.name)
        );

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

exports.postCounter = async(req, res, next) => {
    let contract = new ValidationContract();

    //Validando dados
    contract.isEmail(req.body.email, 'Você deve informar um e-mail válido');
    contract.hasMinLen(req.body.password, 6, 'A sua senha deve ser mais que 6 dígitos');

    if(!contract.isValid()){
        res.status(400).send(contract.errors()).end();
    }
    
    try{
        //Inserindo usuário no banco
        await repository.create({
            name: req.body.name,
            email: req.body.email,
            password:  md5(req.body.password + global.SALT_KEY),
            active: false,
            confirmed: false,
            createdAt: Date.now(),
            roles: ["counter"]
        });

        emailService.send(
            req.body.email,
            'Bem vindo ao Nota Mais',
            global.EMAIL_TMPL.replace('{0}', req.body.name)
        );

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

exports.postEmployee = async(req, res, next) => {
    let contract = new ValidationContract();

    //Validando dados
    contract.isEmail(req.body.email, 'Você deve informar um e-mail válido');
    contract.hasMinLen(req.body.password, 6, 'A sua senha deve ser mais que 6 dígitos');

    if(!contract.isValid()){
        res.status(400).send(contract.errors()).end();
    }
    
    try{
        //Inserindo usuário no banco
        await repository.create({
            name: req.body.name,
            email: req.body.email,
            password:  md5(req.body.password + global.SALT_KEY),
            active: false,
            confirmed: false,
            createdAt: Date.now(),
            roles: ["employee"]
        });

        emailService.send(
            req.body.email,
            'Bem vindo ao Nota Mais',
            global.EMAIL_TMPL.replace('{0}', req.body.name)
        );

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

exports.authenticate = async(req, res, next) => {
    try{
        const user = await repository.authenticate({
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY)
        });

        if(!user){
            res.status(400).send({
                message: 'Usuário ou Senha inválidos'
            });
            return;
        }

        const token = await authService.generateToken({
            id: user._id,
            email: user.email,
            name: user.name,
            roles: user.roles
        });

        res.status(201).send({
            token: token,
            data: {
                id: user._id,
                email: user.email,
                name: user.name,
                roles: user.roles
            }
        });
    }catch(e){
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            data: e
        });
    }
}

exports.refreshToken = async(req, res, next) => {
    try{
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        const data = await authService.decodeToken(token);

        const user = await repository.getById(data.id);

        if(!user){
            res.status(401).send({
                message: 'Usuário não encontrado'
            });
            return;
        }

        const tokenData = await authService.generateToken({
            id: user._id,
            email: user.email,
            name: user.name
        });

        res.status(201).send({
            token: token,
            data: {
                email: user.email,
                name: customer.name
            }
        });
    }catch(e){
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            data: e
        });
    }
}

exports.updatePassword = async(req, res, next) => {
    let contract = new ValidationContract();

    contract.hasMinLen(req.body.password, 6, 'A sua senha deve ser mais que 6 dígitos');

    if(!contract.isValid()){
        res.status(400).send(contract.errors()).end();
    }

    try{

        const user = await repository.getById(req.params.id);

        if(!user){
            res.status(401).send({
                message: 'Usuário não encontrado'
            });
            return;
        }

        let password = md5(req.body.password + global.SALT_KEY);

        await repository.resetPassword(password, req.params.id);

        res.status(201).send({
            message: 'Senha atualizada com sucesso'
        });
    }catch(e){
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            data: e
        });
    }

};

exports.updateProfile = async(req, res, next) => {
    let contract = new ValidationContract();

    //Validando dados
    contract.isEmail(req.body.email, 'Você deve informar um e-mail válido');

    if(!contract.isValid()){
        res.status(400).send(contract.errors()).end();
    }

    try{

        const user = await repository.getById(req.params.id);

        if(!user){
            res.status(401).send({
                message: 'Usuário não encontrado'
            });
        }

        await repository.updateProfile({
            name: req.body.name,
            email: req.body.email
        }, req.params.id);

        res.status(201).send({
            message: 'Perfil atualizado com sucesso'
        });

    }catch(e){
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            data: e
        });
    }
}

exports.confirmed = async(req, res, next) => {
    try{

        await repository.confirmed(req.params.id);

        res.status(201).send({
            message: 'Perfil confirmado com sucesso'
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

        await repository.activate(req.params.id);

        res.status(201).send({
            message: 'Perfil ativado com sucesso'
        });

    }catch(e){
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            data: e
        });
    }
}