'use strict';

//Importando módulos;
const express = require('express');
const fileUpload = require('express-fileupload');
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
const Person = require('./models/person-model');
const Plan = require('./models/plan-model');
const Address = require('./models/address-model');
const Recover = require('./models/recover-model');
const Employee = require('./models/employee-model');
const Auth = require('./models/auth-model');
const Client = require('./models/client-model');
const Card = require('./models/card-model');

//Carregando rotas
const indexroute = require('./routes/index-route');
const userroute = require('./routes/user-route');
const planroute = require('./routes/plan-route');
const addressroute = require('./routes/address-route');
const employeeroute = require('./routes/employee-route');
const cardroute = require('./routes/card-route');

//Limitando tamanho da requisição
app.use(bodyParser.json({
    limit: '5mb'
}));
app.use(bodyParser.urlencoded({ 
    extended: false
}));
app.use(fileUpload());

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
app.use('/plans', planroute);
app.use('/address', addressroute);
app.use('/employees', employeeroute);
app.use('/cards', cardroute);

//Exportando APP
module.exports = app;