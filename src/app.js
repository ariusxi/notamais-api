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
const Contract = require('./models/contract-model');
const File = require('./models/file-model');
const Payment = require('./models/payment-model');
const Relationship = require('./models/relationship-model');
const NFe  = require('./models/nfe-model');
const Imposto = require('./models/imposto-model');
const Dest = require('./models/dest-model');
const Det = require('./models/det-model');
const Emit = require('./models/emit-model');
const Ender = require('./models/ender-model');
const ICMS = require('./models/icms-model');
const IPI = require('./models/ipi-model');
const IDE = require('./models/ide-model');
const infNFe = require('./models/inf-nfe-model');
const Prod = require('./models/prod-model');
const Total = require('./models/total-model');
const Trasp = require('./models/transp-model');
const Evaluation = require('./models/evaluation-model');

//Carregando rotas
const indexroute = require('./routes/index-route');
const userroute = require('./routes/user-route');
const planroute = require('./routes/plan-route');
const addressroute = require('./routes/address-route');
const employeeroute = require('./routes/employee-route');
const cardroute = require('./routes/card-route');
const contractroute = require('./routes/contract-route');
const fileroute = require('./routes/file-route');
const paymentroute = require('./routes/payment-route');
const relationshiproute = require('./routes/relationship-route');
const authroute = require('./routes/auth-route');
const evaluationroute = require('./routes/evaluation-route');

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
app.use('/contracts', contractroute);
app.use('/files', fileroute);
app.use('/payments', paymentroute);
app.use('/relationships', relationshiproute);
app.use('/auths', authroute);
app.use('/evaluations', evaluationroute);

//Exportando APP
module.exports = app;