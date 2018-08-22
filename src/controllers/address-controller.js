'use strict';

const repository = require('../repositories/address-repository');
const path = require('path');
const fs = require('fs');

exports.get = async(req, res, next) => {
    try{
        var data = await repository.get(req.params.id);
        res.status(200).send(data);
    }catch(e){
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            data: e
        })
    }
}

exports.getById = async(req, res, next) =>  {
    try{
        var data = await repository.get(req.params.id);
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
        await repository.create(req.body);

        res.status(201).send({
            message: 'Endereço cadastrado com sucesso'
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
        await repository.update(req.params.id, req.body);
        res.status(200).send({
            message: 'Endereço alterado com sucesso'
        });
    }catch(e){
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            data: e
        });
    }
}

exports.delete = async(req, res, next) => {
    try{
        await repository.delete(req.params.id);
        res.status(200).send({
            message: 'Endereço removido com sucesso'
        });
    }catch(e){
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            data: e
        });
    }
}

exports.photo = async(req, res, next) => {

    let folder = path.resolver(__dirname);

    if(!req.files){
        res.status(422).send({
            message: 'É necessário enviar um arquivo'
        });
    }

    let name =  req.files.file.name;

    let file = req.files.file;
    name = folder + "/../../cache/" + name;

    file.mv(name, (error) =>  {

        if(error){
            res.status(400).send({
                message: 'Falha ao processar sua requisição',
                data: err
            });
        }

        let request = require('request');

        let formData = {
            folder: 'imgs',
            file: fs.createReadStream(name)
        };

        //verificando os parametros
        let query = req.query;
        let queryParam = Object.getOwnPropertyNames(query);
        let qString = "?";

        if(queryParam.length > 0){
            for(let i = 0; i < queryParam.length; i++){
                if((i + 1) === queryParam.length){
                    qString += queryParam[i] + "=" + query[queryParam[i]];
                }else{
                    qString += queryParam[i] + "=" + query[queryParam[i]] + "&";
                }
            }
        }

        if(qString === "?"){
            qString = "";
        }

        request.post({
            url: 'http://localhost/cdn' + qString,
            formData: formData,
            "rejectUnauthorized": false
        }, (err, httpResponse, body) => {
            let response = JSON.parse(body);

            res.status(200).send({
                data: {
                    path: "http://localhost/cdn/" + response.url
                }
            })
        });

    });

}