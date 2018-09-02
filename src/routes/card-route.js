'use strict';

const express = require('express');
const router = express.Router();

//chamando controllers
const controller = require('../controllers/card-controller');
const authService = require('../services/auth-service');

//definindo cada tipo de requisição
router.get('/:user', authService.authorize, controller.get);
router.get('/:id', authService.authorize, controller.getById);
router.post('/create/:id', authService.authorize, controller.post);
router.put('/update/:id', authService.authorize, controller.put);
router.delete('/delete/:id', authService.authorize, controller.delete);

module.exports = router;