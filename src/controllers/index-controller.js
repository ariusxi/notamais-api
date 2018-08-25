'use strict';

const emailService = require('../services/email-service');
const cieloService = require('../services/cielo-service');

exports.get = async(req, res, next) => {
    try{
        cieloService.createTransaction();
        res.status(200).send({
            message: 'Sucesso'
        });
    }catch(e){
        res.status(500).send({
           message: 'Falha  ao processar sua requisição',
           data: e 
        });
    }
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

exports.payment = async(req, body, next) => {
    res.status(200).send({
        title: 'Node Store API',
        version: "0.0.4"
    });
}