'use strict';

const emailService = require('../services/email-service');

exports.get = async(req, res, next) => {
    res.status(200).send({
        title: 'Node Store API',
        version: "0.0.4"
    });
}

exports.post = async(req, res, next) => {
    try{
        emailService.send(
            'notaplus@gmail.com',
            req.body.title,
            global.EMAIL_TMPL.replace('{0}', req.body.text)
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