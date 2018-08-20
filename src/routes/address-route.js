'use strict';

const express = require('express');
const router = express.Router();

//chamando controllers
const controller = require('../controllers/address-controller');
const authService = require('../services/auth-service');

//definindo cada tipo de requisição
router.get('/:id', authService.authorize, controller.get);
router.get('/delete/:id', authService.authorize, controller.delete);
router.get('/fetch-one/:id', authService.authorize, controller.getById);
router.post('/create', authService.authorize, controller.post);
router.post('/update/:id', authService.authorize, controller.put);

module.exports = router;