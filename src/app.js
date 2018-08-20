'use strict';

//Importando módulos;
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');

//Criando aplicação
const app = express();
const router = express.Router();

//Conectando ao banco
mongoose.connect(config.connectionString);

//Carregando Models
const User = require('./models/user-model');
const Plan = require('./models/plan-model');
const Address = require('./models/address-model');

//Carregando rotas
const indexroute = require('./routes/index-route');
const userroute = require('./routes/user-route');
const planroute = require('./routes/plan-route');
const addressroute = require('./routes/address-route');

//Limitando tamanho da requisição
app.use(bodyParser.json({
    limit: '5mb'
}));
app.use(bodyParser.urlencoded({ 
    extended: false
}));

//Habilita o CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
});

//Atribuindo rotas
app.use('/', indexroute);
app.use('/users', userroute);

//Exportando APP
module.exports = app;