'use strict';

const config = require('../config');
const emailService = require('../services/email-service');
const cielo = require('cielo')(config.paramsCielo);

exports.get = async(req, res, next) => {
    res.status(200).send({
        title: 'Node Store API',
        version: "1.0.0"
    });
}

exports.post = async(req, res, next) => {
    try{
        let text = req.body.text + "<br/><br/> De: "+req.body.email;
        emailService.send(
            'notamais2018@gmail.com',
            req.body.title,
            global.EMAIL_TMPL.replace('{0}', text)
        );

        res.status(200).send({
            message: 'Contato enviado com sucesso'
        });
    }catch(e){
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            data: e
        });
    }
}

exports.payment = async(req, res, next) => {
    var dadosSale = {  
        "MerchantOrderId":"2014111703",
        "Customer":{  
           "Name":"Comprador crédito simples"
        },
        "Payment":{  
          "Type":"CreditCard",
          "Amount":15700,
          "Installments":1,
          "SoftDescriptor":"123456789ABCD",
          "CreditCard":{  
              "CardNumber":"0000000000000001",
              "Holder":"Teste Holder",
              "ExpirationDate":"12/2030",
              "SecurityCode":"123",
              "Brand":"Visa"
          }
        }
    }

    await cielo.creditCard.simpleTransaction(dadosSale)
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((err) => {
            res.status(500).send(err);
        });
}

exports.getPayment = async(req, res, next) =>  {
    var dadosSale = {
        paymentId: '01df6e28-6ddd-45db-a095-903c1adb170a',
        amount: '15700'
    }
    
    cielo.creditCard.captureSaleTransaction(dadosSale)
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((err) => {
            res.status(500).send(err);
        })
}

exports.cancelPayment = async(req, res, next) => {
    var dadosSale = {
        paymentId: '01df6e28-6ddd-45db-a095-903c1adb170a',
        amount: '15700'
    }
    
    cielo.creditCard.cancelSale(dadosSale)
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((err) => {
            res.status(500).send(err);
        })
}