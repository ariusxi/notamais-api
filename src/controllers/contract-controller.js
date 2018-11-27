'use strict';

//Chamando repository
const config = require('../config');
const repository = require('../repositories/contract-repository');
const userrepository = require('../repositories/user-repository');
const cardrepository = require('../repositories/card-repository');
const planrepository = require('../repositories/plan-repository');
const clientrepository = require('../repositories/client-repository');
const paymentrepository = require('../repositories/payment-repository');
const employeerepository = require('../repositories/employee-repository');

//Chamando services
const emailService = require('../services/email-service');
const smsService = require('../services/sms-service');
const boletoService = require('../services/boleto-service');
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
        let user = await userrepository.getById(req.params.id);
        let company = req.params.id;

        if(user.roles[0] == 'employee'){
            let companyprofile = await employeerepository.getByPerson(req.params.id);
            company = companyprofile.user;
        }
        var data = await repository.getByUser(company);
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
        let plan = await planrepository.getById('5b9528004b4b744e90c93d6c');
        validade.setDate(validade.getDate() + 7);

        const user = await userrepository.getById(req.body.user);
        const client = await clientrepository.getByUser(req.body.user);

        emailService.send(
            user.email,
            'Periodo de testes iniciado',
            global.EMAIL_TMPL.replace('{0}', 'Olá, <strong>'+user.name+'</strong>, seu periodo de testes foi iniciado, após sete dias seu periodo plano de teste não será mais válido<br/>Após isso será necessário que você contrate um plano para prosseguir a utilização do sistema')
        );

        let telephone = client.telephone;

        await repository.post({
            data: Date.now(),
            shelf_life: validade,
            ativo: true,
            value: plan.value,
            user: req.body.user,
            plan: plan._id
        });
        
        res.status(201).send({
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
    try{
        let user = await userrepository.getById(req.body.user);
        let plan = await planrepository.getById(req.body.plan);
        let cardType = req.body.cardType;
        let paymentType = req.body.paymentType;
        let type = "creditCard";
        let validade = new Date();
        validade.setMonth(validade.getMonth() + 1);
        if(cardType != "CreditCard"){
            type = "debitCard";
        }

        if(paymentType == 'boleto'){
            let boleto = boletoService.generate(plan);
            if(boleto == 'error'){
                res.status(400).send({
                    message: 'Falha ao processar sua requisição'
                });
            }

            setTimeout(() => {
                let formData = {
                    folder: 'boleto',
                    file: fs.createReadStream(__dirname+"./../../boletos/"+boleto)
                };

                request.post({
                    url: 'http://cdnnotamais.com/',
                    formData: formData,
                    "rejectUnauthorized": false
                }, async(err, httpResponse, body) => {
                    if(err){
                        console.error(err);
                    }else{
                        let response = JSON.parse(body);

                        fs.unlink(__dirname+"./../../boletos/"+boleto, (err) => {
                            if(err) throw err;
                            console.log(__dirname+"./../../boletos/"+boleto + ' was deleted');
                        });

                        console.log("http://cdnnotamais.com" + response.url);

                        emailService.send(
                            user.email,
                            'Boleto de pagamento pendente',
                            global.EMAIL_TMPL.replace('{0}', 'Olá <strong>'+user.name+'</strong>, seu plano '+plan.name+' esta com o boleto pendente, acesso o link abaixo para visualizar<br/>http://cdnnotamais.com' + response.url)
                        );

                        res.status(201).send({
                            message: 'Boleto gerado com sucesso',
                            url: "http://cdnnotamais.com" + response.url
                        });
                    }
                })
            }, 1000);
            return;
        }
        
        await cardrepository.post({
            CardNumber: req.body.CardNumber,
            Holder: req.body.Holder,
            ExpirationDate: req.body.ExpirationDate,
            SecurityCode: req.body.SecurityCode,
            Brand: req.body.Brand,
            type: cardType,
            user: req.body.user,
            selected: false
        });

        let preco = plan.value;
        if(plan.promotion){
            preco = plan.promotion;
        }

        let dadosSale = {
            "MerchantOrderId":"2014111706",
            "Customer": {
                "Name": user.name
            },
            "Payment": {
                "Type": cardType,
                "Amount": preco,
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
            .then(async(data) => {
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
                        await repository.post({
                            data: Date.now(),
                            shelf_life: validade,
                            ativo: true,
                            value: preco,
                            user: req.body.user,
                            plan: req.body.plan,
                            type: type
                        });

                        await paymentrepository.post({
                            payment: data.Payment.PaymentId,
                            date: Date.now(),
                            paymentType: cardType,
                            value: preco,
                            user: user._id
                        });

                        emailService.send(
                            user.email,
                            'Plano contratado com sucesso',
                            global.EMAIL_TMPL.replace('{0}', 'Olá <strong>'+user.name+'</strong>, seu plano '+plan.name+' foi contratado com sucesso<br/>O ID da sua transação é '+data.Payment.PaymentId)
                        );
                    
                        res.status(201).send({
                            message: 'Plano contratado com sucesso'
                        });
                        break;
                }
            });
    }catch(e){
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            data: e
        });
    }
    
}

exports.change = async(req, res, next) =>  {
    try{
        let user = await userrepository.getById(req.body.user);
        let plan = await planrepository.getById(req.body.plan);
        let card = {};
        let cardType = req.body.cardType;
        let paymentType = req.body.paymentType;
        let type = "creditCard";
        let validade = new Date();
        validade.setMonth(validade.getMonth() + 1);
        if(cardType != "CreditCard"){
            type = "debitCard";
        }

        if(paymentType == 'boleto'){
            let boleto = boletoService.generate(plan);
            if(boleto == 'error'){
                res.status(400).send({
                    message: 'Falha ao processar sua requisição'
                });
            }

            setTimeout(() => {
                let formData = {
                    folder: 'boleto',
                    file: fs.createReadStream(__dirname+"./../../boletos/"+boleto)
                };

                request.post({
                    url: 'http://cdnnotamais.com/',
                    formData: formData,
                    "rejectUnauthorized": false
                }, async(err, httpResponse, body) => {
                    if(err){
                        console.error(err);
                    }else{
                        let response = JSON.parse(body);

                        fs.unlink(__dirname+"./../../boletos/"+boleto, (err) => {
                            if(err) throw err;
                            console.log(__dirname+"./../../boletos/"+boleto + ' was deleted');
                        });

                        console.log("http://cdnnotamais.com" + response.url);

                        emailService.send(
                            user.email,
                            'Boleto de pagamento pendente',
                            global.EMAIL_TMPL.replace('{0}', 'Olá <strong>'+user.name+'</strong>, seu plano '+plan.name+' esta com o boleto pendente, acesso o link abaixo para visualizar<br/>http://cdnnotamais.com' + response.url)
                        );

                        res.status(201).send({
                            message: 'Boleto gerado com sucesso',
                            url: "http://cdnnotamais.com" + response.url
                        });
                    }
                })
            }, 1000);
            return;
        }

        if(req.body.card){
            card = await cardrepository.getById(req.body.card);
            cardType = card.type;
        }else{
            card = {
                CardNumber: req.body.CardNumber,
                Holder: req.body.Holder,
                ExpirationDate: req.body.ExpirationDate,
                SecurityCode: req.body.SecurityCode,
                Brand: req.body.Brand,
                type: cardType,
                user: req.body.user,
                selected: false
            }
            await cardrepository.post(card);
        }

        let preco = plan.value;
        if(plan.promotion){
            preco = plan.promotion;
        }

        let dadosSale = {
            "MerchantOrderId":"2014111706",
            "Customer": {
                "Name": user.name
            },
            "Payment": {
                "Type": card.type,
                "Amount": preco,
                "Installments": 1,
                "SoftDescription": "123456789ABCD",
                "CreditCard": {
                    "CardNumber": card.CardNumber,
                    "Holder": card.Holder,
                    "ExpirationDate": card.ExpirationDate,
                    "SecurityCode": card.SecurityCode,
                    "Brand" : card.Brand
                }
            }
        };

        cielo.creditCard.simpleTransaction(dadosSale)
            .then(async(data) => {
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
                        await repository.change({
                            data: Date.now(),
                            validade: validade,
                            ativo: true,
                            value: preco,
                            plan: req.body.plan
                        }, req.body.user);

                        await paymentrepository.post({
                            payment: data.Payment.PaymentId,
                            value: preco,
                            paymentType: cardType,
                            date: Date.now(),
                            user: user._id
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

    }catch(e){
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            data: e
        });
    }
   
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