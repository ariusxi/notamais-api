'use strict';

const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/employee-repository');
const personrepository = require('../repositories/person-repository');
const userrepository = require('../repositories/user-repository');
const recoverrepository = require('../repositories/recover-repository');
const md5 = require('md5');

const emailService = require('../services/email-service');
const authService = require('../services/auth-service');

exports.get = async(req, res, next) => {
    try{
        var data  = await repository.get(req.params.id);
        data.forEach(async(value, i) => {
            var person = await personrepository.getByUser(value._id);
            data[i] = data[i].concat(person);
        });
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
        const emailUser = await userrepository.getByEmail(req.body.email);
        const cpfUser = await personrepository.getByCpf(req.body.cpf);

        if(emailUser){
            res.status(400).send({
                message: 'Já existe uma conta cadastrada com esse email'
            });
            return;
        }

        if(cpfUser){
            res.status(400).send({
                message: 'Já existe uma conta cadastrada com esse cpf'
            });
            return;
        }

        //Inserindo usuário no banco
        await userrepository.create({
            name: req.body.name,
            email: req.body.email,
            password:  md5('123456' + global.SALT_KEY),
            active: true,
            confirmed: false,
            createdAt: Date.now(),
            roles: ["employee"]
        });

        const user = await userrepository.getByEmail(req.body.email);

        await personrepository.create({
            name: req.body.name,
            gender: req.body.gender,
            nickname: req.body.nickname,
            cpf: req.body.cpf,
            user: user._id
        });

        const person = await personrepository.getByCpf(req.body.cpf);

        await repository.post({
            admin: false,
            person: user._id,
            user: req.params.id
        }); 

        let token = md5(Date.now() + global.SALT_KEY);

        await recoverrepository.create({
            user: user._id,
            token: token
        });

        emailService.send(
            req.body.email,
            'Novo funcionário',
            global.EMAIL_TMPL.replace('{0}', 'https://notamais.herokuapp.com/views/public/new-password.jsp?token='+token)
        );

        res.status(201).send({
            message: 'Funcionario cadastrado com sucesso, foi enviado um email para '+req.body.email+' para definir uma senha de acesso'
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