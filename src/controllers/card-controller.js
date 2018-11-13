'use strict';

const repository = require('../repositories/card-repository');

exports.get = async(req, res, next) => {
    try{
        var data = await repository.get(req.params.id);
        for(var value in data){
            data[value].CardNumber = "**** **** " + data[value].CardNumber.substr(data[value].CardNumber.length - 4);
        }
        res.status(200).send(data);
    }catch(e){
        res.status(500).send({
            success: false,
            message: 'Falha ao processar sua requisição'
        })
    }
}

exports.getById = async(req, res, next) => {
    try{
        var data = await repository.getById(req.params.id);
        re.status(200).send(data);
    }catch(e){
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            data: e
        });
    }
}

exports.post = async(req, res, next) => {
    try{
        //Tirando espaços do numbero de cartão
        req.body.CardNumber = req.body.CardNumber.split(" ").join("");

        const card = await repository.getByNumber(req.body.CardNumber);
        const year = (new Date()).getFullYear();
        const month = (new Date()).getMonth();

        if(card.length > 0){
            res.status(400).send({
                message: 'Já existe um cartão cadastrado com esses dados'
            });
            return;
        }

        let creditmonth = parseInt(req.body.ExpirationDate.split("/")[0]);
        let credityear = parseInt(req.body.ExpirationDate.split("/")[1]);

        if(credityear < year || (creditmonth < month && credityear == year)){
            res.status(400).send({
                message: 'Data de Expiração inválida'
            });
            return;
        }

        //Inserindo cartão no banco
        await repository.post({
            CardNumber: req.body.CardNumber,
            Holder: req.body.Holder,
            ExpirationDate: req.body.ExpirationDate,
            SecurityCode: req.body.SecurityCode,
            Brand: req.body.Brand,
            type: req.body.type,
            user: req.params.id,
            selected: false
        });

        res.status(201).send({
            success: true,
            message: 'Cartão cadastrado com sucesso'
        });
    }catch(e){
        res.status(500).send({
            success: false,
            message: 'Falha ao processar sua requisição'
        })
    }
}

exports.selected = async(req, res, next) => {
    try{
        //Desabilitando todos os cartões
        await repository.disableAll(req.params.user);

        await repository.selected(req.params.id);

        res.status(201).send({
            message: 'Cartão definido como principal com sucesso'
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
        await repository.put({
            CardNumber: req.body.CardNumber,
            Holder: req.body.Holder,
            ExpirationDate: req.body.ExpirationDate,
            SecurityCode: req.body.SecurityCode,
            Brand: req.body.Brand,
            type: req.body.type
        });

        res.status(201).send({
            message: 'Cartão alterado com sucesso'
        });
    }catch(e){
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            data: e
        });
    }
}

exports.delete = async(req, res, next) => {
    //Removendo cartão pelo id
    try{
        await repository.delete(req.params.id);
        res.status(200).send({
            message: 'Cartão removido com sucesso'
        });
    }catch(e){
        res.status(200).send({
            message: 'Falha ao processar sua requisição',
            data: e
        });
    }
}
