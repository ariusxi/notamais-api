'use strict';

const express = require('express');
const router = express.Router();

//Chamando controllers
const controller = require('../controllers/payment-controller');
const authService = require('../services/auth-service');

//definindo cada tipo de requisição
router.get('/', authService.isAdmin, controller.get);
router.get('/:id', authService.isAdmin, controller.getById);
router.get('/user/:id', authService.isAdmin, controller.getByUser);
router.post('/create', authService.isAdmin, controller.post);

module.exports = router;