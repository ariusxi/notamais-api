'use strict';

//Chamando repository
const repository = require('../repositories/file-repository');
const contractrepository = require('../repositories/contract-repository');
const userrepository = require('../repositories/user-repository');
const personrepository = require('../repositories/person-repository');
const clientrepository = require('../repositories/client-repository');
const employeerepository = require('../repositories/employee-repository');
const relationshiprepository = require('../repositories/relationship-repository');
const nfe = require('nfe-io')('14jQsE8CpQ1lhtR934h7q49qAueUcoBef10CgzWZqTdjZXIiLHKpIy2F8fCBL10rkEw');
const request = require('request');
const path = require('path');
const parser = require('xml2json');
const md5 = require('md5');
const fs = require('fs');

exports.get = async(req, res, next) => {
    try{
        let user = await userrepository.getById(req.params.id);
        let company = req.params.id;

        if(user.roles[0] == 'employee'){
            let companyprofile = await employeerepository.getByPerson(req.params.id);
            company = companyprofile.user;
        }
        if(user.roles[0] == 'counter'){
            let companyprofile = await relationshiprepository.getByCounter(req.params.id);
            company = companyprofile.user._id;
        }

        var data = await repository.get(company);
        res.status(200).send(data);
    }catch(e){
        res.status(500).send({
            message: 'Falha ao processar sua requsição',
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

exports.getAdmin = async(req, res, next) => {
    try{
        var data = await repository.getAll();
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
        let company = req.params.id;

        if(!req.files){
            res.status(422).send({
                message: 'É necessário enviar um arquivo'
            });
            return;
        }

        if(user.roles[0] == 'employee'){
            let companyprofile = await employeerepository.getByPerson(user._id);
            company = companyprofile.user;
            contract = await contractrepository.getByUser(company);
            files = await userrepository.getById(company);
        }

        //Verificando quantidade de XML
        if(files.length >= contract.plan.qtdeXML){
            res.status(400).send({
                message: 'Você atingiu o máximo de envio de XML do seu plano'
            });
            return;
        }

        let name = req.files.file.name;

        let ext = req.files.file.name.split(".")[1];
        let file = req.files.file;
        name = folder + "/../../cache/" + md5(Date.now()) + "." + ext;

        file.mv(name, (error) => {

            if(error){
                res.status(500).send({
                    message: 'Falha ao processar sua requisição',
                    data: error
                });
                return;
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
                url: 'http://cdnnotamais.com/' + qString,
                formData: formData,
                "rejectUnauthorized": false
            }, async(err, httpResponse, body) => {
                let response = JSON.parse(body);

                await repository.post({
                    name: req.body.name,
                    description: req.body.description,
                    date: Date.now(),
                    xml: "http://cdnnotamais.com" + response.url,
                    user: company
                });

                fs.unlink(name, (err) => {
                    if (err) throw err;
                    console.log(name+' was deleted');
                });

                res.status(201).send({
                    message: 'Arquivo enviado com sucesso',
                    path: "http://cdnnotamais.com" + response.url
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

exports.generateCompany = async(req, res, next) =>  {
    try{
        let user = await userrepository.getById(req.params.id);
        let person = await personrepository.getByUser(req.params.id);
        let client = await clientrepository.getByUser(req.params.id);

        client.cnpj = client.cnpj.replace(/[^\d]+/g,'');

        let data = {
            'federalTaxNumber': client.cnpj, 
            'name': user.name,
            'tradeName': user.name,
            'municipalTaxNumber': client.ie,
            'taxRegime': 'SimplesNacional',
            'specialTaxRegime': 'Nenhum',
            'address': {
                'country': 'BRA',
                'postalCode': '70073901',
                'street': 'Outros Quadra 1 Bloco G Lote 32',
                'number': 'S/N',
                'additionalInformation': 'QUADRA 01 BLOCO G',
                'district': 'Asa Sul', 
                'city': { 
                    'code': '5300108',
                    'name': 'Brasilia'
                },
                'state': 'DF'
            }
        };

        nfe.companies.create(data, async(err, entity) => {
            if(err){ 
                res.status(500).send({
                    message: 'Falha ao processar sua requisição',
                    data: err
                });
            }else{
                let idNfe = entity.location.split("/")[2];

                await clientrepository.putNfeId(idNfe, req.params.id);

                res.status(201).send({
                    message: 'Empresa registrada no NFE com sucesso'
                });
            }
        });
    }catch(e){
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            data: e
        });
    }
}

exports.generateDanfe = async(req, res, next) => {
    try{
        let file = await repository.getById(req.params.id);

        console.log(file);

        request(file.xml, (error, response, body) => {
            if(error) throw new error;
            let xml = body.toString();
            let json = parser.toJson(xml);
            json = JSON.parse(json);
            res.status(200).send(json);
        });
    }catch(e){
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            data: e
        });
    }
}

exports.generateNfe = async(req, res, next) => {
    let file = await repository.getById(req.params.id);
    let user = await userrepository.getById(req.params.id);
    let person = await userrepository.getByUser(req.params.id);
    let client = await clientrepository.getByUser(req.params.id);

    request(file.xml, (error, response, body) => {
        if(error) throw new error;
        let xml = body.toString();
        let json = parser.toJson(xml);
        json = JSON.parse(json);

        /*let data = {
            'cityServiceCode': '2690',
            'description': 'TESTE EMISSAO',
            'servicesAmount': 100.00,
            'borrower': {
                'type': 'LegalEntity',
                'federalTaxNumber': 191,
                'name': 'BANCO DO BRASIL SA',
                'email': 'exemplo@bb.com.br',
                'address': {
                    'country': 'BRA',
                    'postalCode': '70073901',
                    'street': 'Outros Quadra 1 Bloco G Lote 32',
                    'number': 'S/N',
                    'additionalInformation': 'QUADRA 01 BLOCO G',
                    'district': 'Asa Sul',
                    'city': {
                        'code': '5300108',
                        'name': 'Brasilia'
                    },
                    'state': 'DF'
                }
            }
        };
    
        nfe.serviceInvoices.create(
             // ID da empresa, você deve copiar exatamente como está no painel
            client.idNfe, data, (err, invoice) => {
                if(err) console.error(err);
                console.log(invoice);
            }
        );*/
        res.status(200).send(json);
    });
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