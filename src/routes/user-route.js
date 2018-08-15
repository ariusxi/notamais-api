'use strict';

const express = require('express');
const router = express.Router();

//chamando controllers
const controller = require('../controllers/user-controller');
const authService = require('../services/auth-service');

//definindo cada tipo de requisição
router.get('/fetch-all', controller.get);
router.get('/confirmed', controller.confirmed);
router.get('/activate', controller.activate);
router.post('/create', controller.post);
router.post('/auth', controller.authenticate);
router.post('/refresh-token', controller.refreshToken);

//Rotas que precisam de token
router.post('/reset-password/:id', authService.authorize, controller.updatePassword);
router.post('/update-profile/:id', authService.authorize, controller.updateProfile);

module.exports = router;