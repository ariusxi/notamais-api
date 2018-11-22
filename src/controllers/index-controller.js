'use strict';

const config = require('../config');
const emailService = require('../services/email-service');
const boletoService = require('../services/boleto-service');
const cielo = require('cielo')(config.paramsCielo);
const path = require('path');
const fs = require('fs');
const md5 = require('md5');
const parser = require('xml2json');
const request = require('request');

exports.get = async(req, res, next) => {
    res.status(200).send({
        title: 'Node Store API',
        version: "1.0.4"
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

exports.contact = async(req, res, next) => {
    try{
        let text = req.body.text + "<br/><br/> De: "+req.body.email;
        emailService.send(
            'ongjataimataatlanticao@gmail.com',
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

exports.photo = async(req, res, next) => {

    let folder = path.resolve(__dirname);

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
            url: 'http://cdnnotamais.com/' + qString,
            formData: formData,
            "rejectUnauthorized": false
        }, (err, httpResponse, body) => {
            let response = JSON.parse(body);

            res.status(200).send({
                path: "http://cdnnotamais.com/" + response.url
            });
        });

    });

}

exports.danfeGen = async(req, res, next) => {
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

    let pathDoArquivo = path.join(__dirname + "./../../danfe", md5(Date.now())+'.pdf');

    let emitente = new Emitente();
    emitente.comNome('Nota+');
    emitente.comLogotipo(path.join(__dirname, './../../danfe/img/logotipo.png'));
    emitente.comRegistroNacional('14.625.996/0001-35');
    emitente.comInscricaoEstadual('03.707.130-0');
    emitente.comTelefone('(61) 3322-4455');
    emitente.comEmail('contato@acme.ind.br');
    emitente.comEndereco(new Endereco()
                .comLogradouro('Rua dos Testes')
                .comNumero('42')
                .comComplemento('Sala 1389 - Ed. Nodeunit')
                .comCep('72.100-300')
                .comBairro('Bairro da Integração')
                .comMunicipio('Testolândia')
                .comCidade('Belo Horizonte')
                .comUf('MG'));

    let destinatario = new Destinatario();
    destinatario.comNome('Cliente Feliz da Silva');
    destinatario.comRegistroNacional('250.796.466-91');
    destinatario.comTelefone('2123124389');
    destinatario.comEndereco(new Endereco()
                .comLogradouro('Av. Brasil')
                .comNumero('132')
                .comComplemento('Fundos')
                .comCep('71.010-130')
                .comBairro('Padre Miguel')
                .comMunicipio('Rio de Janeiro')
                .comCidade('Rio de Janeiro')
                .comUf('RJ'));

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
    protocolo.comCodigo('123451234512345');
    protocolo.comData(new Date(2014, 10, 19, 13, 24, 35));

    let impostos = new Impostos();
    impostos.comBaseDeCalculoDoIcms(100);
    impostos.comValorDoIcms(17.5);
    impostos.comBaseDeCalculoDoIcmsSt(90);
    impostos.comValorDoIcmsSt(6.83);
    impostos.comValorDoImpostoDeImportacao(80);
    impostos.comValorDoPis(70);
    impostos.comValorTotalDoIpi(60);
    impostos.comValorDaCofins(50);
    impostos.comBaseDeCalculoDoIssqn(40);
    impostos.comValorTotalDoIssqn(30);

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

    for(let i = 0; i < 50; i++){
        danfe.adicionarItem(new Item()
            .comCodigo('' + i)
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

        new Gerador(danfe).gerarPDF({
            ambiente: 'homologacao',
            ajusteYDoLogotipo: -4,
            ajusteYDaIdentificacaoDoEmitente: 4,
            creditos: 'Nota Mais - https://notamais.herokuapp.com/'
        }, (err, pdf) => {
            if(err){ 
                res.status(500).send({
                    message: 'Falha ao processar sua requisição',
                    data: err
                });
            }else{
                pdf.pipe(fs.createWriteStream(pathDoArquivo));

                res.status(200).send({
                    message: 'Danfe gerada com sucesso'
                });
            }
        });
    }
}

exports.getContent = async(req, res, next) => {
    try{
        request('http://cdnnotamais.com/xml/884086fe24c8ceeb3ae17fe70d61f5e1.xml', (error, response, body) => {
            if(error) throw new error;
            let xml = body.toString();
            let json = parser.toJson(xml);
            console.log(json);
        });
    }catch(e){
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            data: e
        });
    }
}

exports.boleto = async(req, res, next) => {
    try{
        boletoService.generate();
        res.status(200).send({
            message: 'Boleto gerado com sucesso'
        });
    }catch(e){
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            data: e
        });
    }
}