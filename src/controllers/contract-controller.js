'use strict';

//Chamando repository
const config = require('../config');
const repository = require('../repositories/contract-repository');
const userrepository = require('../repositories/user-repository');
const cardrepository = require('../repositories/card-repository');
const planrepository = require('../repositories/plan-repository');

//Chamando services
const emailService = require('../services/email-service');
const cielo = require('cielo')(config.paramsCielo);

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

exports.test = async(req, res, next) => {
    try{
        let validade = new Date();
        let plan = await planrepository.get('5b8d629cc67ec50014abda73');
        validade.setDate(validade.getDate() + 7);

        const user = userrepository.getById(req.body.user);

        emailService.send(
            user.email,
            'Periodo de testes iniciado',
            global.EMAIL_TMPL.replace('{0}', 'Olá, <strong>'+user.name+'</strong>, seu periodo de testes foi iniciado, após sete dias seu periodo plano de teste não será mais válido<br/>Após isso será necessário que você contrate um plano para prosseguir a utilização do sistema')
        );

        repository.post({
            data: Date.now(),
            shelf_life: validade,
            ativo: true,
            value: plan.value,
            user: req.body.user,
            plan: plan._id
        });
        
        res.status(200).send({
            message: 'Periodo de testes iniciado com sucesso'
        });
    }catch(e){
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            data: e
        });
    }
}

exports.post = async(req, res, next) => {
    
        let user = await userrepository.getById(req.body.user);
        let plan = await planrepository.getById(req.body.plan);
        let cardType = req.body.cardType;
        let type = "creditCard";
        let validade = new Date();
        validade.setMonth(validade.getMonth() + 1);
        if(cardType != "CreditCard"){
            type = "debitCard";
        }
        
        await cardrepository.post({
            CardNumber: req.body.CardNumber,
            Holder: req.body.Holder,
            ExpirationDate: req.body.ExpirationDate,
            SecurityCode: req.body.SecurityCode,
            Brand: req.body.Brand,
            type: cardType,
            user: req.body.user
        });

        let dadosSale = {
            "MerchantOrderId":"2014111706",
            "Customer": {
                "Name": user.name
            },
            "Payment": {
                "Type": cardType,
                "Amount": plan.value,
                "Installments": 1,
                "SoftDescription": "123456789ABCD",
                "CreditCard": {
                    "CardNumber": req.body.CardNumber,
                    "Holder": req.body.Holder,
                    "ExpirationDate": req.body.ExpirationDate,
                    "SecurityCode": req.body.SecurityCode,
                    "Brand" : req.body.Brand
                }
            }
        };
        
        cielo.creditCard.simpleTransaction(dadosSale)
            .then((data) => {
                switch(data.Payment.ReturnCode){
                    case "05":
                        res.status(400).send({
                            message: "Não Autorizada"
                        });
                        break;
                    case "57":
                        res.status(400).send({
                            message: "Cartão Expirado"
                        });
                        break;
                    case "78":
                        res.status(400).send({
                            message: "Cartão Bloqueado"
                        });
                        break;
                    case "99":
                        res.status(400).send({
                            message: "Time Out"
                        });
                        break;
                    case "77":
                        res.status(400).send({
                            message: "Cartão Cancelado"
                        });
                        break;
                    case "70":
                        res.status(400).send({
                            message: "Problemas com o Cartão de Crédito"
                        });
                        break;
                    case "99":
                        res.status(400).send({
                            message: "Operation Successful / Time Out"
                        });
                        break;
                    default:
                        repository.post({
                            data: Date.now(),
                            shelf_life: validade,
                            ativo: true,
                            value: plan.value,
                            user: req.body.user,
                            plan: req.body.plan
                        });

                        emailService.send(
                            user.email,
                            'Plano contratado com sucesso',
                            global.EMAIL_TMPL.replace('{0}', 'Olá, <strong>'+user.name+'</strong>, seu plano '+plan.name+' foi contratado com sucesso<br/>O ID da sua transação é '+data.Payment.PaymentId)
                        );
                
                        res.status(201).send({
                            message: 'Plano contratado com sucesso'
                        });
                        break;
                }
            });
    
}

exports.renew = async(req, res, next) => {
    try{
        let validade = Date.now();
        validade.setMonth(validade.getMonth() + 1);
        let data = {
            data: Date.now(),
            validate: validade
        };

        await repository.renew(data, req.body.user);

        res.status(201).send({
            message: 'Plano renovado com sucesso com sucesso'
        });
    }catch(e){
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            data: e
        });
    }
}

exports.cancel = async(req, res, next) => {
    try{
        await repository.delete(req.params.id);
        res.status(200).send({
            message: 'Contrato cancelado com sucesso'
        });
    }catch(e){
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            data: e
        });
    }
}