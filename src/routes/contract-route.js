'use strict';

const express = require('express');
const router = express.Router();

//chamando controllers
const controller = require('../controllers/contract-controller');
const authService = require('../services/auth-service');

//definindo cada tipo de requisição
router.get('/user/:id', authService.authorize, controller.getByUser);
router.post('/create', authService.authorize, controller.post);
router.post('/test', authService.authorize,  controller.test);
router.post('/renew/:id', authService.authorize, controller.renew);
router.post('/cancel/:id', authService.authorize, controller.cancel);
router.post('/change/', authService.authorize, controller.change);

//Rotas que precisal de nivel de acesso
router.get('/', authService.isAdmin, controller.get);
router.get('/:id', authService.isAdmin, controller.getById);

module.exports = router;