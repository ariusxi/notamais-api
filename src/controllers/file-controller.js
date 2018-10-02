'use strict';

//Chamando repository
const repository = require('../repositories/file-repository');
const contractrepository = require('../repositories/contract-repository');
const userrepository = require('../repositories/user-repository');
const personrepository = require('../repositories/person-repository');
const clientrepository = require('../repositories/client-repository');
const employeerepository = require('../repositories/employee-repository');
const relationshiprepository = require('../repositories/relationship-repository');
const filerepository = require('../repositories/file-repository');
const nfe = require('nfe-io')('14jQsE8CpQ1lhtR934h7q49qAueUcoBef10CgzWZqTdjZXIiLHKpIy2F8fCBL10rkEw');
const request = require('request');
const path = require('path');
const parser = require('xml2json');
const md5 = require('md5');
const fs = require('fs');

const utilService = require('./../services/util-service');

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
    let dan = require('danfe');
    let Gerador = dan.Gerador,
        Danfe = dan.Danfe,
        Emitente = dan.Emitente,
        Destinatario = dan.Destinatario,
        Transportador = dan.Transportador,
        Endereco = dan.Endereco,
        Protocolo = dan.Protocolo,
        Impostos = dan.Impostos,
        Volumes = dan.Volumes,
        Item = dan.Item;

    let pathDoArquivo = path.join(__dirname + "./../../danfe", md5(Date.now() + 1)+'.pdf');

    let file = await repository.getById(req.params.id);
    let user = await userrepository.getById(file.user);
    let client = await clientrepository.getByUser(file.user);

    let json = {};

    request(file.xml, async(error, response, body) => {
        if(error) throw new error; 
        let xml = body.toString();
        json = parser.toJson(xml);
        json = JSON.parse(json);
        json = json.NFe.infNFe;
        
        let emitente = new Emitente();
            emitente.comNome(user.name);
            emitente.comLogotipo(path.join(__dirname, './../../danfe/img/logotipo.png'));
            emitente.comRegistroNacional(client.cnpj);
            emitente.comInscricaoEstadual(client.ie);
            emitente.comTelefone(client.telephone);
            emitente.comEmail(user.email);
            emitente.comEndereco(new Endereco()
                        .comLogradouro(json.emit.enderEmit.xLgr)
                        .comNumero(json.emit.enderEmit.nro)
                        .comComplemento('')
                        .comCep('72.100-300')
                        .comBairro(json.emit.enderEmit.xBairro)
                        .comMunicipio(json.emit.enderEmit.xMun)
                        .comCidade(json.emit.enderEmit.UF)
                        .comUf(json.emit.enderEmit.UF));

            let destinatario = new Destinatario();
            destinatario.comNome(json.dest.xNome);
            destinatario.comRegistroNacional('28.124.151/0001-70');
            destinatario.comTelefone('2123124389');
            destinatario.comEndereco(new Endereco()
                        .comLogradouro(json.dest.enderDest.xLgr)
                        .comNumero(json.dest.enderDest.nro)
                        .comComplemento('')
                        .comCep('71.010-130')
                        .comBairro(json.dest.enderDest.xBairro)
                        .comMunicipio(json.dest.enderDest.xMun)
                        .comCidade(json.dest.enderDest.UF)
                        .comUf(json.dest.enderDest.UF));

            let transportador = new Transportador();
            transportador.comNome('Carroceria Cheia Transportes Ltda');
            transportador.comRegistroNacional('28.124.151/0001-70');
            transportador.comInscricaoEstadual('0731778300131');
            transportador.comCodigoAntt('ASDASD');
            transportador.comPlacaDoVeiculo('ZZZ-9090');
            transportador.comUfDaPlacaDoVeiculo('AP');
            transportador.comEndereco(new Endereco()
                        .comLogradouro('Rua Imaginária')
                        .comNumero('S/N')
                        .comCep('70000000')
                        .comBairro('Bairro Alto')
                        .comMunicipio('Cocalzinho de Goiás')
                        .comCidade('Cocalzinho de Goiás')
                        .comUf('GO'));

            let protocolo = new Protocolo();
            protocolo.comCodigo(utilService.generateProtocol(15));
            protocolo.comData(new Date());

            let impostos = new Impostos();
            impostos.comBaseDeCalculoDoIcms(json.total.ICMSTot.vBC);
            impostos.comValorDoIcms(json.total.ICMSTot.vICMS);
            impostos.comBaseDeCalculoDoIcmsSt(json.total.ICMSTot.vBCST);
            impostos.comValorDoIcmsSt(json.total.ICMSTot.vST);
            impostos.comValorDoImpostoDeImportacao(json.total.ICMSTot.vII);
            impostos.comValorDoPis(json.total.ICMSTot.vPIS);
            impostos.comValorTotalDoIpi(json.total.ICMSTot.vIPI);
            impostos.comValorDaCofins(json.total.ICMSTot.vCOFINS);
            impostos.comBaseDeCalculoDoIssqn(json.total.ICMSTot.vNF);
            impostos.comValorTotalDoIssqn(json.total.ICMSTot.vTotTrib);

            let volumes = new Volumes();
            volumes.comQuantidade(1342);
            volumes.comEspecie('À GRANEL');
            volumes.comMarca('Apple');
            volumes.comNumeracao('AB73256343-4');
            volumes.comPesoBruto('1.578Kg');
            volumes.comPesoLiquido('1.120Kg');

            let danfe = new Danfe();
            danfe.comChaveDeAcesso('52131000132781000178551000000153401000153408');
            danfe.comEmitente(emitente);
            danfe.comDestinatario(destinatario);
            danfe.comTransportador(transportador);
            danfe.comProtocolo(protocolo);
            danfe.comImpostos(impostos);
            danfe.comVolumes(volumes);
            danfe.comTipo('saida');
            danfe.comNaturezaDaOperacao('VENDA');
            danfe.comNumero(1420);
            danfe.comSerie(100);
            danfe.comDataDaEmissao(new Date(2014, 10, 19));
            danfe.comDataDaEntradaOuSaida(new Date(2014, 10, 19, 12, 43, 59));
            danfe.comModalidadeDoFrete('porContaDoDestinatarioRemetente');
            danfe.comInscricaoEstadualDoSubstitutoTributario('102959579');
            danfe.comInformacoesComplementares('Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi non quis exercitationem culpa nesciunt nihil aut nostrum explicabo reprehenderit optio amet ab temporibus asperiores quasi cupiditate. Voluptatum ducimus voluptates voluptas? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi non quis exercitationem culpa nesciunt nihil aut nostrum consectetur adipisicing elit. Eligendi non quis exercitationem culpa nesciunt nihil aut nostrum nihil aut nostrum');
            danfe.comValorTotalDaNota(250.13);
            danfe.comValorTotalDosProdutos(120.10);
            danfe.comValorTotalDosServicos(130.03);
            danfe.comValorDoFrete(23.34);
            danfe.comValorDoSeguro(78.65);
            danfe.comDesconto(1.07);
            danfe.comOutrasDespesas(13.32);

            for(let i = 0; i < 1; i++){
                danfe.adicionarItem(new Item()
                    .comCodigo('' + (i + 1))
                    .comDescricao('Produto')
                    .comNcmSh('15156000')
                    .comOCst('020')
                    .comCfop('6101')
                    .comUnidade('LT')
                    .comQuantidade('3.1415')
                    .comValorUnitario(2.31)
                    .comValorTotal(7.13)
                    .comBaseDeCalculoDoIcms(5.01)
                    .comValorDoIcms(0.67)
                    .comValorDoIpi(0.03)
                    .comAliquotaDoIcms(0.1753)
                    .comAliquotaDoIpi(0.0034));
            }

            new Gerador(danfe).gerarPDF({
                ambiente: 'homologacao',
                ajusteYDoLogotipo: -4,
                ajusteYDaIdentificacaoDoEmitente: 4,
                creditos: 'Nota Mais - https://notamais.herokuapp.com/'
            }, async(err, pdf) => {
                if(err){ 
                    console.log(err);
                }else{
                    console.log(pathDoArquivo);
                    pdf.pipe(fs.createWriteStream(pathDoArquivo));

                    let formData = {
                        folder: 'danfe',
                        file: fs.createReadStream(pathDoArquivo)
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

                            console.log(response);

                            await repository.putDanfe({
                                url: "http://cdnnotamais.com" + response.url
                            }, req.params.id);

                            fs.unlink(pathDoArquivo, (err) => {
                                if(err) throw err;
                                console.log(pathDoArquivo + ' was deleted');
                            });

                            res.status(201).send({
                                message: 'Danfe gerada com sucesso',
                                url: "http://cdnnotamais.com" + response.url
                            });
                        }
                    });
                }
            });
    });
}

exports.generateNfe = async(req, res, next) => {
    try{
        let file = await repository.getById(req.params.id);
        let user = await userrepository.getById(file.user);
        let client = await clientrepository.getByUser(file.user);

        request(file.xml, (error, response, body) => {
            if(error) throw new error;
            let xml = body.toString();
            let json = parser.toJson(xml);
            json = JSON.parse(json);

            let data = {
                'cityServiceCode': '2690',
                'description': file.description,
                'servicesAmount': json.NFe.infNFe.total.ICMSTot.vTotTrib,
                'borrower': {
                    'type': 'LegalEntity',
                    'federalTaxNumber': 191,
                    'name': user.name,
                    'email': user.email,
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
                client.idNfe, data, async(err, invoice) => {
                    if(err){
                        res.status(500).send({
                            message: 'Falha ao processar sua requisição'
                        });
                    }else{
                        let nfe = invoice.location.split("/")[5];
                        await filerepository.putNfe(file._id, nfe);
                        res.status(201).send({
                            message: 'Nota fiscal emitida com sucesso'
                        });
                    }
                }
            );
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