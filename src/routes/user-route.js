'use strict';

const express = require('express');
const router = express.Router();

//Chamando controllers
const controller = require('../controllers/user-controller');
const authService = require('../services/auth-service');

//Definindo cada tipo de requisição
router.get('/confirmed/:id', controller.confirmed);
router.get('/activate/:id', controller.activate);
router.post('/create', controller.post);
router.post('/create-admin', controller.postAdmin);
router.post('/create-counter', controller.postCounter);
router.post('/auth', controller.authenticate);
router.post('/refresh-token', controller.refreshToken);
router.post('/generate-token', controller.generateToken);
router.post('/update-password/:token', controller.updatePasswordNonAuth);
router.post('/update-image/:id', authService.authorize, controller.updateImage);

//Rotas que precisam de token
router.get('/fetch-all', authService.isAdmin, controller.get);
router.get('/block/:id', authService.isAdmin, controller.block);
router.get('/get-profile/:id', authService.authorize, controller.getProfile);
router.get('/get-user/:id', authService.isAdmin, controller.getProfile);
router.get('/counter-view/:id', authService.authorize, controller.searchCounterView);
router.post('/reset-password/:id', authService.authorize, controller.updatePassword);
router.post('/update-profile/:id', authService.authorize, controller.updateProfile);
router.post('/search-counter/:id', authService.authorize, controller.searchCounters);

//Rota para testes
router.delete('/delete', authService.authorize, controller.delete);

module.exports = router;