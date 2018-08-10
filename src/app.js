'use strict';

//Importando módulos;
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//Criando aplicação
const app = express();
const router = express.Router();

//Carregando rotas
const indexroute = require('./routes/index-route');

//Atribuindo rotas
app.use('/', indexroute);

//Exportando APP
module.exports = app;