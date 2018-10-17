'use strict';

const express = require('express');
const router  = express.Router();

//chamando controllers
const controller = require('../controllers/evaluation-controller');
const authService = require('../services/auth-service');

//Rotas para usuários
router.get('/to/:id', authService.authorize, controller.getByTo);
router.get('/from/:id', authService.authorize, controller.getByFrom);
router.get('/get/:id', authService.authorize, controller.getById);
router.post('/create', authService.authorize, controller.create);
router.put('/update/:id', authService.authorize, controller.update);
router.delete('/delete/:id', authService.authorize, controller.delete);

//Rota para admin
router.get('/', authService.isAdmin, controller.get);

module.exports = router;