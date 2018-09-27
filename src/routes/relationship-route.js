'use strict';

const express = require('express');
const router = express.Router();

//chamando controllers
const controller = require('../controllers/relationship-controller');
const authService = require('../services/auth-service');

//definindo cada tipo de requisição
router.get('/user/:id', authService.authorize, controller.getByUser);
router.get('/counter/:id', authService.authorize, controller.getByCounter);
router.get('/get/:id', authService.authorize, controller.getById);
router.post('/create', authService.authorize, controller.create);
router.delete('/delete/:id', authService.authorize, controller.delete);

//Rotas que precisam de acesso do admin
router.get('/', authService.isAdmin, controller.get);

module.exports = router;