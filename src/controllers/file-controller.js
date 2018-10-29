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

//Repositories do nfe
const destrepository = require('../repositories/dest-repository');
const detrepository = require('../repositories/det-repository');
const emitrepository = require('../repositories/emit-repository');
const enderrepository = require('../repositories/ender-repository');
const icmsrepository = require('../repositories/icms-repository');
const iderepository = require('../repositories/ide-repository');
const impostorepository = require('../repositories/imposto-repository');
const infnferepository = require('../repositories/inf-nfe-repository');
const nferepository = require('../repositories/nfe-repository');
const prodrepository = require('../repositories/prod-repository');
const totalrepository = require('../repositories/total-repository');
const transprepository = require('../repositories/transp-repository');
const ipirepository = require('../repositories/ipi-repository');

//Bibliotecas
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
            company = companyprofile[0].user._id;
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

        req.body.name = name;
        req.body.description = name;

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

                fs.unlink(name, (err) => {
                    if (err) throw err;
                    console.log(name+' was deleted');
                });

                let url = response.url;

                request("http://cdnnotamais.com" + response.url, async(error, response, body) => {
                    if(error){
                        res.status(500).send({
                            data: 'Falha ao processar sua requisição',
                            data: error
                        });
                        return;
                    }

                    let xml = body.toString();
                    let json = parser.toJson(xml);
                    json = JSON.parse(json);
                    json = json.NFe.infNFe;

                    await enderrepository.create({
                        cep: json.emit.enderEmit.CEP,
                        uf: json.emit.enderEmit.UF,
                        cMun: json.emit.enderEmit.cMun,
                        cPais: json.emit.enderEmit.cPais,
                        nro: json.emit.enderEmit.nro,
                        xBairro: json.emit.enderEmit.xBairro,
                        xLgr: json.emit.enderEmit.xLgr,
                        xMun:  json.emit.enderEmit.xMun,
                        xPais: json.emit.enderEmit.xPais
                    });
    
                    const ender1 = await enderrepository.getByData({
                        cep: json.emit.enderEmit.CEP,
                        uf: json.emit.enderEmit.UF,
                        cMun: json.emit.enderEmit.cMun,
                        cPais: json.emit.enderEmit.cPais,
                        nro: json.emit.enderEmit.nro,
                        xBairro: json.emit.enderEmit.xBairro,
                        xLgr: json.emit.enderEmit.xLgr,
                        xMun:  json.emit.enderEmit.xMun,
                        xPais: json.emit.enderEmit.xPais
                    });
    
                    await emitrepository.create({
                        xNome: json.emit.xNome,
                        cnpj: json.emit.CNPJ,
                        ie: json.emit.IE,
                        crt: json.emit.CRT,
                        ender: ender1._id
                    });
    
                    const emit = await emitrepository.getByData({
                        xNome: json.emit.xNome,
                        cnpj: json.emit.CNPJ,
                        ie: json.emit.IE,
                        crt: json.emit.CRT,
                        ender: ender1._id
                    });
    
                    await enderrepository.create({
                        cep: json.dest.enderDest.CEP,
                        uf: json.dest.enderDest.UF,
                        cMun: json.dest.enderDest.cMun,
                        cPais: json.dest.enderDest.cPais,
                        nro: json.dest.enderDest.nro,
                        xBairro: json.dest.enderDest.xBairro,
                        xLgr: json.dest.enderDest.xLgr,
                        xMun:  json.dest.enderDest.xMun,
                        xPais: json.dest.enderDest.xPais
                    });
    
                    const ender2 = await enderrepository.getByData({
                        cep: json.dest.enderDest.CEP,
                        uf: json.dest.enderDest.UF,
                        cMun: json.dest.enderDest.cMun,
                        cPais: json.dest.enderDest.cPais,
                        nro: json.dest.enderDest.nro,
                        xBairro: json.dest.enderDest.xBairro,
                        xLgr: json.dest.enderDest.xLgr,
                        xMun:  json.dest.enderDest.xMun,
                        xPais: json.dest.enderDest.xPais
                    });
    
                    await destrepository.create({
                        cpfcnpj: json.dest.CNPJ,
                        ie: json.dest.IE,
                        xNome: json.dest.xNome,
                        indEDest: json.dest.indIEDest,
                        ender: ender2._id
                    });
    
                    const dest = await destrepository.getByData({
                        cpfcnpj: json.dest.CNPJ,
                        ie: json.dest.IE,
                        xNome: json.dest.xNome,
                        indEDest: json.dest.indIEDest,
                        ender: ender2._id
                    });
    
                    await totalrepository.create({
                        vBC: json.total.ICMSTot.vBC,
                        vICMS: json.total.ICMSTot.vICMS,
                        vICMSDeson: json.total.ICMSTot.vICMSDeson,
                        vBCST: json.total.ICMSTot.vBCST,
                        vST: json.total.ICMSTot.vST,
                        vProd: json.total.ICMSTot.vProd,
                        vFrete: json.total.ICMSTot.vFrete,
                        vSeg: json.total.ICMSTot.vSeg,
                        vII: json.total.ICMSTot.vII,
                        vIPI: json.total.ICMSTot.vIPI,
                        vPIS: json.total.ICMSTot.vPIS,
                        vCOFINS: json.total.ICMSTot.vCOFINS,
                        vOutro: json.total.ICMSTot.vOutro,
                        vNF: json.total.ICMSTot.vNF
                    });
    
                    const total = await totalrepository.getByData({
                        vBC: json.total.ICMSTot.vBC,
                        vICMS: json.total.ICMSTot.vICMS,
                        vICMSDeson: json.total.ICMSTot.vICMSDeson,
                        vBCST: json.total.ICMSTot.vBCST,
                        vST: json.total.ICMSTot.vST,
                        vProd: json.total.ICMSTot.vProd,
                        vFrete: json.total.ICMSTot.vFrete,
                        vSeg: json.total.ICMSTot.vSeg,
                        vII: json.total.ICMSTot.vII,
                        vIPI: json.total.ICMSTot.vIPI,
                        vPIS: json.total.ICMSTot.vPIS,
                        vCOFINS: json.total.ICMSTot.vCOFINS,
                        vOutro: json.total.ICMSTot.vOutro,
                        vNF: json.total.ICMSTot.vNF
                    });
    
                    await iderepository.create({
                        cMunFG: json.ide.cMunFG,
                        cUF: json.ide.cUF,
                        dhEmi: json.ide.dhEmi,
                        finNFe: json.ide.finNFe,
                        idDest: json.ide.idDest,
                        indFinal: json.ide.indFinal,
                        indPag: json.ide.indPag,
                        indPres: json.ide.indPres,
                        mod: json.ide.mod,
                        natOp: json.ide.natOp,
                        procEmit: json.ide.procEmi,
                        serie: json.ide.serie,
                        tpAmb: json.ide.tpAmb,
                        tpNF: json.ide.tpNF
                    });
    
                    const ide = await iderepository.getByData({
                        cMunFG: json.ide.cMunFG,
                        cUF: json.ide.cUF,
                        dhEmi: json.ide.dhEmi,
                        finNFe: json.ide.finNFe,
                        idDest: json.ide.idDest,
                        indFinal: json.ide.indFinal,
                        indPag: json.ide.indPag,
                        indPres: json.ide.indPres,
                        mod: json.ide.mod,
                        natOp: json.ide.natOp,
                        procEmit: json.ide.procEmi,
                        serie: json.ide.serie,
                        tpAmb: json.ide.tpAmb,
                        tpNF: json.ide.tpNF
                    });
    
                    await transprepository.create({
                        cnpj: json.emit.CNPj,
                        ie: json.emit.IE,
                        xNome: json.emit.xNome,
                        modFrete: json.transp.modFrete,
                        xMun:  json.emit.enderEmit.xMun,
                        uf: json.emit.enderEmit.UF
                    });
    
                    const transp = await transprepository.getByData({
                        cnpj: json.emit.CNPj,
                        ie: json.emit.IE,
                        xNome: json.emit.xNome,
                        modFrete: json.transp.modFrete,
                        xMun:  json.emit.enderEmit.xMun,
                        uf: json.emit.enderEmit.UF
                    });
    
                    await ipirepository.create({
                        cEnq: json.det.imposto.IPI.cEnq
                    });
    
                    const ipi = await ipirepository.getByData({
                        cEnq: json.det.imposto.IPI.cEnq
                    });
    
                    await icmsrepository.create({
                        origin: json.det.imposto.ICMS.ICMS00.origin,
                        modBC: json.det.imposto.ICMS.ICMS00.modBC,
                        pICMSST: json.det.imposto.ICMS.ICMS00.pICMS,
                        vICMSST: json.det.imposto.ICMS.ICMS00.vICMS
                    });
    
                    const icms = await icmsrepository.getByData({
                        origin: json.det.imposto.ICMS.ICMS00.origin,
                        modBC: json.det.imposto.ICMS.ICMS00.modBC,
                        pICMSST: json.det.imposto.ICMS.ICMS00.pICMS,
                        vICMSST: json.det.imposto.ICMS.ICMS00.vICMS
                    });
    
                    await impostorepository.create({
                        CST: json.det.imposto.ICMS.ICMS00.CST,
                        vBC: json.det.imposto.COFINSST.vBC,
                        valor: json.det.imposto.vTotTrib,
                        ipi: ipi._id,
                        icms: icms._id
                    })
    
                    const imposto = await impostorepository.getByData({
                        CST: json.det.imposto.ICMS.ICMS00.CST,
                        vBC: json.det.imposto.COFINSST.vBC,
                        valor: json.det.imposto.vTotTrib,
                        ipi: ipi._id,
                        icms: icms._id
                    });
    
                    await prodrepository.create({
                        cfop: json.det.prod.CFOP,
                        ncm: json.det.prod.NCM,
                        cProd: json.det.prod.cProd,
                        indTot: json.det.prod.indTot,
                        qCom: json.det.prod.qCom,
                        qTrib: json.det.prod.qTrib,
                        uCom: json.det.prod.uCom,
                        uTrib: json.det.prod.uTrib,
                        vProd: json.det.prod.vProd,
                        vUnCom: json.det.prod.vUnCom,
                        vUnTrib: json.det.prod.vUnTrib,
                        xProd: json.det.prod.xProd
                    });
    
                    const prod = await prodrepository.getByData({
                        cfop: json.det.prod.CFOP,
                        ncm: json.det.prod.NCM,
                        cProd: json.det.prod.cProd,
                        indTot: json.det.prod.indTot,
                        qCom: json.det.prod.qCom,
                        qTrib: json.det.prod.qTrib,
                        uCom: json.det.prod.uCom,
                        uTrib: json.det.prod.uTrib,
                        vProd: json.det.prod.vProd,
                        vUnCom: json.det.prod.vUnCom,
                        vUnTrib: json.det.prod.vUnTrib,
                        xProd: json.det.prod.xProd
                    });
    
                    await detrepository.create({
                        nItem: '1',
                        prod: prod._id,
                        imposto: imposto._id
                    });
    
                    const det = detrepository.getByData({
                        nItem: '1',
                        prod: prod._id,
                        imposto: imposto._id
                    });

                    await repository.post({
                        name: req.body.name,
                        description: req.body.description,
                        date: Date.now(),
                        xml: "http://cdnnotamais.com" + url,
                        user: company
                    });

                    const file = await repository.getByData({
                        name: req.body.name,
                        description: req.body.description,
                        xml: "http://cdnnotamais.com" + url,
                        user: company
                    });

                    await infnferepository.create({
                        versao: json.versao,
                        ide: ide._id,
                        total: total._id,
                        dest: dest._id,
                        emite: emit._id,
                        transp: transp._id,
                        ide: ide._id,
                        dest: dest._id,
                        file: file._id,
                        user: company
                    });

                    const infnfe = await infnferepository.getByData({
                        versao: json.versao,
                        ide: ide._id,
                        total: total._id,
                        dest: dest._id,
                        emite: emit._id,
                        transp: transp._id,
                        ide: ide._id,
                        dest: dest._id,
                        file: file._id,
                        user: company
                    });

                    res.status(201).send({
                        message: 'Arquivo enviado com sucesso',
                        path: "http://cdnnotamais.com" + url
                    });    
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

exports.getAll = async(req, res, next) => {
    try{
        let user = await userrepository.getById(req.params.id);
        let company = req.params.id;

        if(user.roles[0] == 'employee'){
            let companyprofile = await employeerepository.getByPerson(req.params.id);
            company = companyprofile.user._id;
        }
        if(user.roles[0] == 'counter'){
            let companyprofile = await relationshiprepository.getByCounter(req.params.id);
            company = companyprofile[0].user._id;
        }

        var begin, end;

        if(begin == undefined || begin == "")
            begin = new Date('1990-12-01');
        else
            begin = new Date(req.body.begin);

        if(end == undefined || end == "")
            end = new Date('2090-12-01');
        else
            end = new Date(req.body.end);

        var data = await infnferepository.getAll(begin, end, company);
        res.status(200).send(data);
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
                let idNfe = entity.location.split("/");
                idNfe = idNfe[idNfe.length - 1];

                await clientrepository.putNfeId(idNfe, req.params.id);

                res.status(201).send({
                    message: 'Empresa registrada no NFE com sucesso',
                    id: idNfe
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

        if(!file.nfe){
            res.status(403).send({
                message: 'Você deve emitir essa nota fiscal para gerar uma DANFE'
            });
            return;
        }

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
                        pdf.pipe(fs.createWriteStream(pathDoArquivo));

                        setTimeout(function(){
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

                                    await repository.putDanfe({
                                        url: "http://cdnnotamais.com" + response.url
                                    }, req.params.id);

                                    fs.unlink(pathDoArquivo, (err) => {
                                        if(err) throw err;
                                        console.log(pathDoArquivo + ' was deleted');
                                    });

                                    console.log("http://cdnnotamais.com" + response.url);

                                    res.status(201).send({
                                        message: 'Danfe gerada com sucesso',
                                        url: "http://cdnnotamais.com" + response.url
                                    });
                                }
                            });
                        }, 1000);
                    }
                });
        });
}

exports.generateNfe = async(req, res, next) => {
    try{
        let file = await repository.getById(req.params.id);
        let user = await userrepository.getById(file.user);
        let client = await clientrepository.getByUser(file.user);

        if(!client.idNfe){
            res.status(403).send({
                message: 'Você deve ativar a sua conta no SEFAZ para emitir NFE'
            });
            return;
        }

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