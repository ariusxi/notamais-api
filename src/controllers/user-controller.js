'use strict';

const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/user-repository');
const clientrepository = require('../repositories/client-repository');
const recoverrepository = require('../repositories/recover-repository');
const personrepository = require('../repositories/person-repository');
const contractrepository = require('../repositories/contract-repository');
const authrepository = require('../repositories/auth-repository');
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

exports.getProfile = async(req, res, next) => {
    try{
        let user = await repository.getById(req.params.id);
        let profile = await personrepository.get(req.params.id);
        let client = [];
        if(user.roles[0] == 'user'){
            client = await clientrepository.get(req.params.id);
        }

        res.status(200).send({
            user: user,
            profile: profile,
            client: client
        });
    }catch(e){
        res.status(500).send({
            message: 'Falha ao processsar sua requisição',
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

        const user = await repository.getByEmail(req.body.email);

        await personrepository.create({ 
            gender: req.body.gender,
            nickname: req.body.nickname,
            cpf: req.body.cpf,
            user: user._id
        });

        await clientrepository.create({
            fantasia: req.body.fantasia,
            cnpj: req.body.cnpj,
            ie: req.body.ie,
            telephone: req.body.telephone,
            user: user._id
        });

        emailService.send(
            req.body.email,
            'Bem vindo ao Nota Mais',
            global.EMAIL_TMPL.replace('{0}', 'Olá, <strong>'+req.body.name+'</strong>, seja bem vindo ao Nota Mais!<br/>Clique no link para ativar a sua conta http://localhost:8080/notamais-web/acess-user.jsp?id='+user._id)
        );

        res.status(201).send({
            message: 'Cadastro efetuado com sucesso, por favor confirme o cadastro pelo email '+req.body.email
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

        const user = await repository.getByEmail(req.body.email);

        await personrepository.create({
            gender: req.body.gender,
            nickname: req.body.nickname,
            cpf: req.body.cpf,
            user: user._id
        });

        emailService.send(
            req.body.email,
            'Bem vindo ao Nota Mais',
            global.EMAIL_TMPL.replace('{0}', 'Olá, <strong>'+req.body.name+'</strong>, seja bem vindo ao Nota Mais!')
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

        const user = await repository.getByEmail(req.body.email);

        await personrepository.create({
            gender: req.body.gender,
            nickname: req.body.nickname,
            cpf: req.body.cpf,
            user: user._id
        });

        emailService.send(
            req.body.email,
            'Bem vindo ao Nota Mais',
            global.EMAIL_TMPL.replace('{0}', 'Olá, <strong>'+req.body.name+'</strong>, seja bem vindo ao Nota Mais!<br/>Clique no link para ativar a sua conta http://localhost:8080/notamais-web/acess-user.jsp?id='+user._id)
        );

        res.status(201).send({
            message: 'Cadastro efetuado com sucesso, por favor confirme o cadastro pelo email '+req.body.email
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

        if(user.active == false){
            res.status(400).send({
                message: 'Esse usuário ainda não foi ativado no sistema'
            });
            return;
        }

        const token = await authService.generateToken({
            id: user._id,
            email: user.email,
            name: user.name,
            roles: user.roles
        });

        const first = await authrepository.getByUser(user._id);

        let firstlogin = false;
        if(!first){
            firstlogin = true;
        }

        await authrepository.create({
            date: Date.now(),
            ip: req.body.ip,
            session: token,
            user: user._id
        });

        let contract = {
            active: false,
            data: {}
        };

        if(user.roles[0] == 'user'){
            //Pegando dados de contrato
            const ctnc = await contractrepository.getByUser(user._id);
            let date = new Date();
            if(ctnc && ctnc.shelf_life > date){
                contract.active = true;
                contract.data = ctnc;
            }
        }

        res.status(201).send({
            token: token,
            data: {
                contract: contract,
                firstlogin: firstlogin,
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
            name: user.name,
            used: false
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

exports.generateToken = async(req, res, next) => {
    let contract = new ValidationContract();

    contract.isEmail(req.body.email, 'Você deve informar um e-mail válido');

    if(!contract.isValid()){
        res.status(400).send(contract.errors()).end();
    }

    try{

        let token = md5(Date.now() + global.SALT_KEY);

        const user = await repository.getByEmail(req.body.email);

        if(!user){
            res.status(401).send({
                message: 'Usuário não encontrado'
            });
            return;
        }

        await recoverrepository.create({
            user: user._id,
            token: token
        });

        emailService.send(
            req.body.email,
            'Recuperação de Senha',
            global.EMAIL_TMPL.replace('{0}', 'http://localhost:8080/notamais-web/views/public/new-password.jsp?token='+token)
        );

        res.status(200).send({
            message: 'Token gerado com sucesso'
        });

    }catch(e){
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            data: e
        });
    }
}

exports.updatePasswordNonAuth = async(req, res, next) => {
    let contract = new ValidationContract();
    
    contract.hasMinLen(req.body.password, 6, 'A sua senha deve ser mais que 6 dígitos');

    if(!contract.isValid()){
        res.status(400).send(contract.errors()).end();
    }

    try{

        const token = await recoverrepository.get(req.params.token);

        if(!token){
            res.status(401).send({
                message: 'Token inválido'
            });
        }

        let password = md5(req.body.password + global.SALT_KEY);

        await repository.resetPassword(password, token.user);

        await recoverrepository.used(req.params.token);

        res.status(201).send({
            message: 'Senha atualizada com sucesso'
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

        await personrepository.update({
            gender: req.body.gender,
            nickname: req.body.nickname,
            cpf: req.body.cpf
        }, req.params.id);

        if(user.roles[0] == 'user'){
            await clientrepository.put({
                fantasia: req.body.fantasia,
                cnpj: req.body.cnpj,
                ie: req.body.ie,
                telephone: req.body.telephone
            }, req.params.id);
        }

        if(req.body.password && req.body.password != ""){
            let password = md5(req.body.password + global.SALT_KEY);
            await repository.resetPassword(password, req.params.id);
        }

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

        const user = repository.getById(req.params.id);

        if(!user){
            res.status(401).send({
                message: 'Usuário não encontrado'
            });
            return;
        }

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

exports.block = async(req, res, next) => {
    try{
        const user = await repository.getById(req.params.id);

        if(!user){
            res.status(401).send({
                message: 'Usuário não encontrado'
            });
            return;
        }

        let block = true;
        if(user.active == true){
            block = false;
        }
        await repository.block(req.params.id, block);
        
        res.status(201).send({
            message: 'Status de perfil alterado com sucesso'
        });
    }catch(e){
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            data: e
        });
    }
}