'use strict';

const express = require('express');
const router = express.Router();

//chamando controllers
const controller = require('../controllers/plan-controller');
const authService = require('../services/auth-service');

//definindo cada tipo de requisição
router.get('/', controller.get);
router.get('/get/:id', controller.getById);

//Rotas que precisam de nivel de acesso
router.get('/fetch-all', authService.isAdmin, controller.getAdmin);
router.get('/delete/:id', authService.isAdmin, controller.delete);
router.post('/create', authService.isAdmin, controller.post);
router.post('/update/:id', authService.isAdmin, controller.put);
router.post('/activate/:id', authService.isAdmin, controller.activate);

module.exports = router;