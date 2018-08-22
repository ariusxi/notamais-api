'use strict';

const express = require('express');
const router = express.Router();

//chamando controllers
const controller = require('../controllers/employee-controller');
const authService = require('../services/auth-service');

//definindo cada tipo de requisição
router.get('/fetch-all/:id', authService.authorize, controller.get);
router.post('/create', authService.authorize, controller.post);
router.put('/update', authService.authorize, controller.put);

module.exports = router;