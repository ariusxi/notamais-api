'use strict';

const express = require('express');
const router = express.Router();

//chamando controllers
const controller = require('../controllers/plan-controller');
const authService = require('../services/auth-service');

//definindo cada tipo de requisição
router.get('/', controller.get);

//Rotas que precisam de nivel de acesso
router.post('/create', authService.isAdmin, controller.post);

module.exports = router;