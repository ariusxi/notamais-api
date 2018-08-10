'use strict';

//Importando módulos;
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//Criando aplicação
const app = express();
const router = express.Router();

//Conectando ao banco
mongoose.connect('mongodb://admin:master123@ds018268.mlab.com:18268/notamais');

//Carregando Models
const User = require('./models/user-model');

//Carregando rotas
const indexroute = require('./routes/index-route');
const userroute = require('./routes/user-route');

//Atribuindo rotas
app.use('/', indexroute);

//Exportando APP
module.exports = app;