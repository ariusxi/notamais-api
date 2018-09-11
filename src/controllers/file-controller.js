'use strict';

//Chamando repository
const repository = require('../repositories/file-repository');
const contractrepository = require('../repositories/contract-repository');
const userrepository = require('../repositories/user-repository');
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

exports.post = async(req, res, next) => {
    try{
        let folder = path.resolve(__dirname);

        let contract = await contractrepository.getByUser(req.params.id);
        let files = await repository.getByUser(req.params.id);
        let user = await userrepository.getById(req.params.id);

        if(!req.files){
            res.status(422).send({
                message: 'É necessário enviar um arquivo'
            });
            return;
        }

        //Verificando quantidade de XML
        if(files.length >= contract.plan.qtdeXML){
            res.status(400).send({
                message: 'Você atingiu o máximo de envio de XML do seu plano'
            });
            return;
        }

        let name = req.files.file.name;

        let file = req.files.file;
        name = folder + "/../../cache/" + name;

        file.mv(name, (error) => {

            if(error){
                res.status(400).send({
                    message: 'Falha ao processar sua requisição',
                    data: error
                });
            }

            let request = require('request');

            let formData = {
                folder: 'xml',
                file: fs.createReadStream(name)
            };

            //Verificando os parametros
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
                url: 'https://cdn-notamais.herokuapp.com/' + qString,
                formData: formData,
                "rejectUnauthorized": false
            }, async(err, httpResponse, body) => {
                let response = JSON.parse(body);

                await repository.post({
                    date: Date.now(),
                    xml: "https://cdn-notamais.herokuapp.com" + response.url,
                    user: user._id
                });

                fs.unlink(name, (err) => {
                    if (err) throw err;
                    console.log(name+' was deleted');
                });

                res.status(200).send({
                    message: 'Arquivo enviado com sucesso',
                    path: "https://cdn-notamais.herokuapp.com" + response.url
                });

            });

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
        //Removendo arquivo
        await repository.delete(req.params.id);
        res.status(200).send({
            message: 'Arquivo removido com sucesso'
        });
    }catch(e){
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            data: e
        });
    }
}