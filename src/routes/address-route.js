'use strict';

const express = require('express');
const router = express.Router();

//chamando controllers
const controller = require('../controllers/address-controller');
const authService = require('../services/auth-service');

//definindo cada tipo de requisição
router.get('/:id', authService.authorize, controller.get);
router.post('/create', authService.authorize, controller.post);

module.exports = router;